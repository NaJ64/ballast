using System;
using System.Threading.Tasks;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.Hubs
{
    public abstract class ServiceHubBase : Hub
    {

        protected readonly IPlayerConnectionRepository _playerConnections;

        public ServiceHubBase(IPlayerConnectionRepository playerConnections) 
        {
            _playerConnections = playerConnections;
        }

        public async Task RegisterClientAsync(Guid invocationId, Guid clientId)
        {
            try
            {
                // TODO: Map the Context.ConnectionId and clientId together
                await OnClientRegisteredAsync(Context.ConnectionId, clientId);
                await ResolveAsync(Clients.Caller, nameof(RegisterClientAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(RegisterClientAsync), invocationId, ex.Message);
            }
        }

        public virtual Task OnClientRegisteredAsync(string connectionId, Guid clientId)
        {
            // Override me
            return Task.CompletedTask;
        }

        protected async Task ResolveAsync(IClientProxy client, string clientMethodName, Guid invocationId) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, null);

        protected async Task ResolveValueAsync<TValue>(IClientProxy client, string clientMethodName, Guid invocationId, TValue value) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, null, value);

        protected async Task RejectAsync(IClientProxy client, string clientMethodName, Guid invocationId, string reason) =>
            await client.SendAsync($"{clientMethodName}Callback", invocationId, reason, null);

    }

}