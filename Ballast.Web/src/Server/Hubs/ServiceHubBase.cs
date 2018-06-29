using Ballast.Core.Messaging;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs
{
    public abstract class ServiceHubBase : Hub
    {

        protected readonly IEventBus _eventBus;

        public ServiceHubBase(IEventBus eventBus) 
        {
            _eventBus = eventBus;
        }

        public async Task RegisterClientAsync(Guid invocationId, Guid clientId)
        {
            try
            {
                // TODO: Map the Context.ConnectionId and clientId together
                RegisterClientConnection(Context.ConnectionId, clientId);
                await ResolveAsync(Clients.Caller, nameof(RegisterClientAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(RegisterClientAsync), invocationId, ex.Message);
            }
        }

        public virtual void RegisterClientConnection(string connectionId, Guid clientId)
        {
            // Override me
        }

        protected async Task ResolveAsync(IClientProxy client, string clientMethodName, Guid invocationId) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, null);

        protected async Task ResolveValueAsync<TValue>(IClientProxy client, string clientMethodName, Guid invocationId, TValue value) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, value);

        protected async Task RejectAsync(IClientProxy client, string clientMethodName, Guid invocationId, string reason) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, reason, null);

    }

}