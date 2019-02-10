using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace Ballast.Client.SignalR.Services
{
    public abstract class SignalRClientServiceBase : IDisposable
    {

        private readonly ISignalRClientOptions _options;
        private readonly HashSet<string> _methods;
        private readonly HashSet<string> _subscriptions;
        private readonly IDictionary<string, IDictionary<Guid, TaskCompletionSource<object>>> _invocations;
        private HubConnection _hubConnection;
        private string _hubConnectionState;

        private const string STATE_DISCONNECTED = "disconnected";
        private const string STATE_CONNECTED = "connected";
        private const string STATE_CONNECTING = "connecting";

        protected abstract string HubName { get; }

        protected virtual void AfterSubscribe(HubConnection hubConnection) { }
        protected virtual void BeforeUnsubscribe(HubConnection hubConnection) { }
        protected virtual void OnDispose() { }

        public SignalRClientServiceBase(ISignalRClientOptions options) 
        {
            _options = options;
            _methods = new HashSet<string>();
            _subscriptions = new HashSet<string>();
            _invocations = new Dictionary<string, IDictionary<Guid, TaskCompletionSource<object>>>();
            _hubConnectionState = STATE_DISCONNECTED;
        }

        public void Dispose()
        {
            if (_hubConnection != null) 
                _ = DisconnectAsync(); // Fire and forget
            OnDispose();
        }

        public bool IsConnected => _hubConnection != null && _hubConnectionState == STATE_CONNECTED;

        public bool IsConnecting => _hubConnection != null && _hubConnectionState == STATE_CONNECTING;

        private HubConnection CreateHubConnection()
        {
            var options = _options;
            var hubName = HubName;
            var hub = $"{options.ServerUrl}/{hubName}";
            var connectionBuilder = new HubConnectionBuilder();
            var connection = connectionBuilder.WithUrl(hub).Build();
            return connection;
        }

        public async Task ConnectAsync()
        {
            if (IsConnected)
                await DisconnectAsync();
            _hubConnectionState = STATE_CONNECTING;
            _hubConnection = CreateHubConnection();
            ResubscribeToHubEvents();
            await _hubConnection.StartAsync();
            _hubConnectionState = STATE_CONNECTED;
            await RegisterClientAsync();
        }

        private async Task RegisterClientAsync() 
        {
            var options = _options;
            var clientId = options.ClientId;
            await CreateInvocationAsync<int>("registerClientAsync", clientId);
        }

        public async Task DisconnectAsync()
        {
            if (_hubConnection != null)
            {
                UnsubscribeFromHubEvents();
                await _hubConnection.StopAsync();
            }
            _hubConnection = null;
            _hubConnectionState = STATE_DISCONNECTED;
        }

        protected void RegisterHubMethod(string method)
        {
            _methods.Add(method);
            RegisterCallbackForHubMethod(method);
        }

        private void RegisterCallbackForHubMethod(string methodName)
        {
            // Do not proceed unless are have a hub connection
            if (this._hubConnection == null) {
                return;
            }
            // Register fulfillment (callback) subscription for the current method
            var callback = $"{methodName}Callback";
            _subscriptions.Add(callback);
            _hubConnection.On(callback, (Guid invocationId, string reason, object value) => {
                // Get the list of all currently running/live method invocations
                var currentInvocations = GetInvocationList(methodName);
                currentInvocations.TryGetValue(invocationId, out var foundInvocation);
                if (foundInvocation == null)
                    return;
                if (reason != null)
                    foundInvocation.SetException(new Exception(reason));
                else
                    foundInvocation.SetResult(value); // if there was no error or value object we assume void method (int)
                // Remove from the list of invocations (task fulfilled/completed)
                currentInvocations.Remove(invocationId);
            });
        }

        protected async Task OnConnectionClosed(Exception ex = null)
        {
            // Try to re-open
            _hubConnectionState = STATE_DISCONNECTED;
            if (this._hubConnection != null)
            {
                _hubConnectionState = STATE_CONNECTING;
                await _hubConnection.StartAsync();
                _hubConnectionState = STATE_CONNECTED;
            }
        }

        protected void ResubscribeToHubEvents()
        {
            // Unsubscribe from all (if already subscribed)
            UnsubscribeFromHubEvents();
            // Make sure we have a hub connection instance
            if (_hubConnection == null)
                throw new InvalidOperationException("Cannot (re)subscribe to hub events without a hub connection");
            // Iterate through registered hub methods
            foreach(var methodName in _methods)
            {
                RegisterCallbackForHubMethod(methodName);
            }
            AfterSubscribe(_hubConnection);
            _hubConnection.Closed += OnConnectionClosed;
        }

        protected void UnsubscribeFromHubEvents()
        {
            if (_hubConnection != null)
            {
                BeforeUnsubscribe(_hubConnection);
                var subscriptions = _subscriptions;
                foreach (var subscription in subscriptions)
                {
                    _hubConnection.Remove(subscription);
                }
            }
            _subscriptions.Clear();
        }

        protected Guid CreateInvocationId() => Guid.NewGuid();
        
        protected IDictionary<Guid, TaskCompletionSource<object>> GetInvocationList(string method)
        {
            if (!_invocations.ContainsKey(method))
                _invocations[method] = new Dictionary<Guid, TaskCompletionSource<object>>();
            return _invocations[method];
        }

        protected async Task CreateInvocationAsync(string method, params object[] args)
        {
            _ = await CreateInvocationAsync<object>(method, args);
        }

        protected async Task<TValue> CreateInvocationAsync<TValue>(string method, params object[] args)
        {
            if (!_methods.Contains(method))
                RegisterHubMethod(method);
            if (IsConnecting)
                throw new InvalidOperationException("Invocation could not be created because the service is still attempting to establish a connection");
            if (!IsConnected)
                await ConnectAsync();
            var tcs = new TaskCompletionSource<object>();
            _ = Task.Run(async () =>
            {
                var invocationList = GetInvocationList(method);
                var invocationId = CreateInvocationId();
                invocationList[invocationId] = tcs;
                try
                {
                    await InvokeOnHubAsync(method, invocationId, args);
                }
                catch(Exception ex)
                {
                    tcs.SetException(ex);
                }
            }); // Fire and forget
            // Use Task.ContinueWith to map Task<object> to Task<TValue>
            return await tcs.Task.ContinueWith(x => (TValue)x.Result);
        }

        private void CancelInvocation(string method, Guid invocationId, string cancellationReason)
        {
            // Get the list of all currently running/live method invocations
            var currentInvocations = GetInvocationList(method);
            currentInvocations.TryGetValue(invocationId, out var foundInvocation);
            if (foundInvocation == null)
                return;
            // Cancel/reject the invocation
            foundInvocation.SetException(new InvalidOperationException(cancellationReason));
            // Remove from the list of invocations (fulfilled/completed task)
            currentInvocations.Remove(invocationId);
        }

        private async Task InvokeOnHubAsync(string method, Guid invocationId, params object[] args)
        {
            if (IsConnecting)
                throw new InvalidOperationException("Invocation could not take place because the service is still attempting to establish a connection");
            if (!IsConnected)
                await ConnectAsync();
            if (IsConnected)
            {
                var invocationIdPlusArgs = (new object[] { invocationId }).Concat(args);
                await _hubConnection.InvokeAsync(method, invocationIdPlusArgs);
            }
        }

    }
}