using System.Threading.Tasks;
using Ballast.Client.SignalR.Services;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Services;
using Ballast.Core.Messaging;
using Microsoft.AspNetCore.SignalR.Client;

namespace Ballast.Client.SignalR.Services 
{
    public class SignalRClientApplicationEventEmitter : SignalRClientServiceBase, IApplicationEventEmitter
    {

        private readonly IEventBus _eventBus;
        private bool _isEnabled;

        public SignalRClientApplicationEventEmitter(ISignalRClientOptions options, IEventBus eventBus) : base(options)
        {
            _eventBus = eventBus;
            _isEnabled = false;
        }

        protected override string HubName => "eventhub";

        public bool IsEnabled => _isEnabled;

        public Task StartAsync()
        {
            _isEnabled = true;
            return Task.CompletedTask;
        }

        public Task StopAsync()
        {
            _isEnabled = false;
            return Task.CompletedTask;
        }

        protected override void AfterSubscribe(HubConnection hubConnection)
        {
            hubConnection.On<IApplicationEvent>("IApplicationEvent", OnApplicationEvent);
        }

        protected override void BeforeUnsubscribe(HubConnection hubConnection)
        {
            hubConnection.Remove("IApplicationEvent");
        }

        private void OnApplicationEvent(IApplicationEvent evt)
        {
            if (!_isEnabled)
                return;
            _ = _eventBus.PublishAsync(evt); // Fire and forget
        }

    }
}