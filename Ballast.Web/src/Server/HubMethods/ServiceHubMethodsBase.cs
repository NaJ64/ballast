using Ballast.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.HubMethods
{
    public abstract class ServiceHubMethodsBase<TServiceHub> where TServiceHub : ServiceHubBase
    {
        protected readonly IHubContext<TServiceHub> _hubContext;

        public ServiceHubMethodsBase(IHubContext<TServiceHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // public async Task ResolveAsync(IClientProxy client, string clientMethodName, Guid invocationId) =>
        //     await client.SendAsync($"{clientMethodName}Callback", invocationId, null, null);

        // public async Task ResolveValueAsync<TValue>(IClientProxy client, string clientMethodName, Guid invocationId, TValue value) =>
        //     await client.SendAsync($"{clientMethodName}Callback", invocationId, null, value);

        // public async Task RejectAsync(IClientProxy client, string clientMethodName, Guid invocationId, string reason) =>
        //     await client.SendAsync($"{clientMethodName}Callback", invocationId, reason, null);

    }
}