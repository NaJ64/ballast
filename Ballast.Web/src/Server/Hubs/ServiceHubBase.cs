using Ballast.Core.Messaging;
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

        protected async Task ResolveAsync(IClientProxy client, string clientMethodName, Guid invocationId) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, null);

        protected async Task ResolveValueAsync<TValue>(IClientProxy client, string clientMethodName, Guid invocationId, TValue value) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, value);

        protected async Task RejectAsync(IClientProxy client, string clientMethodName, Guid invocationId, string reason) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, reason, null);

    }

}