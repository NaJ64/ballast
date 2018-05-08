using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs
{
    public abstract class ServiceHubBase : Hub
    {

        protected async Task ResolveAsync(IClientProxy client, string clientMethodName, Guid invocationId) =>
            await client.SendAsync(clientMethodName, invocationId, null, null);

        protected async Task ResolveValueAsync<TValue>(IClientProxy client, string clientMethodName, Guid invocationId, TValue value) =>
            await client.SendAsync(clientMethodName, invocationId, null, value);

        protected async Task RejectAsync(IClientProxy client, string clientMethodName, Guid invocationId, string reason) =>
            await client.SendAsync(clientMethodName, invocationId, reason, null);

    }

}