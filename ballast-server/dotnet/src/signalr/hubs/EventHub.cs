
using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Services;
using Ballast.Core.Messaging;
using Ballast.Server.SignalR.HubMethods;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.Hubs 
{
    public class EventHub : ServiceHubBase
    {

        private readonly EventHubMethods _hubMethods;
        private readonly IEventBus _eventBus;

        public EventHub(
            IPlayerConnectionRepository<ChatHub> playerConnections, 
            EventHubMethods hubMethods,
            IEventBus eventBus
        ) : base(playerConnections)
        {
            _hubMethods = hubMethods;
            _eventBus = eventBus;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _playerConnections.Add(Context.ConnectionId);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var playerId = _playerConnections.GetPlayerId(Context.ConnectionId).GetValueOrDefault();
            _playerConnections.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async override Task OnClientRegisteredAsync(string connectionId, Guid clientId)
        {
            _playerConnections.SetPlayerId(connectionId, clientId);
            await Task.CompletedTask;
        }

    }
}