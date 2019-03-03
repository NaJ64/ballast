using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Services;
using Ballast.Core.Messaging;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.HubMethods
{
    public class EventHubMethods : ServiceHubMethodsBase<EventHub>
    {

        private readonly IEventBus _eventBus;

        public EventHubMethods(
            IHubContext<EventHub> hubContext, 
            IPlayerConnectionRepository<EventHub> playerConnections, 
            IEventBus eventBus
        ) : base(hubContext, playerConnections) 
        { 
            _eventBus = eventBus;
            SubscribeAll();
        }

        public override void Dispose()
        {
            UnsubscribeAll();
        }

        private void SubscribeAll()
        {
            _eventBus.Subscribe<ChatMessageSentEvent>(ChatMessageSentEvent.GetId(), OnChatMessageSentEventAsync);
            _eventBus.Subscribe<GameStateChangedEvent>(GameStateChangedEvent.GetId(), OnGameStateChangedEventAsync);
            _eventBus.Subscribe<PlayerAddedToVesselRoleEvent>(PlayerAddedToVesselRoleEvent.GetId(), OnPlayerAddedToVesselRoleEventAsync);
            _eventBus.Subscribe<PlayerJoinedGameEvent>(PlayerJoinedGameEvent.GetId(), OnPlayerJoinedGameEventAsync);
            _eventBus.Subscribe<PlayerLeftGameEvent>(PlayerLeftGameEvent.GetId(), OnPlayerLeftGameEventAsync);
            _eventBus.Subscribe<PlayerRemovedFromVesselRoleEvent>(PlayerRemovedFromVesselRoleEvent.GetId(), OnPlayerRemovedFromVesselRoleEventAsync);
            _eventBus.Subscribe<PlayerSignedInEvent>(PlayerSignedInEvent.GetId(), OnPlayerSignedInEventAsync);
            _eventBus.Subscribe<PlayerSignedOutEvent>(PlayerSignedOutEvent.GetId(), OnPlayerSignedOutEventAsync);
            _eventBus.Subscribe<VesselMovedInDirectionEvent>(VesselMovedInDirectionEvent.GetId(), OnVesselMovedInDirectionEventAsync);
            _eventBus.Subscribe<VesselStateChangedEvent>(VesselStateChangedEvent.GetId(), OnVesselStateChangedEventAsync);
        }

        private void UnsubscribeAll()
        {
            _eventBus.Unsubscribe<ChatMessageSentEvent>(ChatMessageSentEvent.GetId(), OnChatMessageSentEventAsync);
            _eventBus.Unsubscribe<GameStateChangedEvent>(GameStateChangedEvent.GetId(), OnGameStateChangedEventAsync);
            _eventBus.Unsubscribe<PlayerAddedToVesselRoleEvent>(PlayerAddedToVesselRoleEvent.GetId(), OnPlayerAddedToVesselRoleEventAsync);
            _eventBus.Unsubscribe<PlayerJoinedGameEvent>(PlayerJoinedGameEvent.GetId(), OnPlayerJoinedGameEventAsync);
            _eventBus.Unsubscribe<PlayerLeftGameEvent>(PlayerLeftGameEvent.GetId(), OnPlayerLeftGameEventAsync);
            _eventBus.Unsubscribe<PlayerRemovedFromVesselRoleEvent>(PlayerRemovedFromVesselRoleEvent.GetId(), OnPlayerRemovedFromVesselRoleEventAsync);
            _eventBus.Unsubscribe<PlayerSignedInEvent>(PlayerSignedInEvent.GetId(), OnPlayerSignedInEventAsync);
            _eventBus.Unsubscribe<PlayerSignedOutEvent>(PlayerSignedOutEvent.GetId(), OnPlayerSignedOutEventAsync);
            _eventBus.Unsubscribe<VesselMovedInDirectionEvent>(VesselMovedInDirectionEvent.GetId(), OnVesselMovedInDirectionEventAsync);
            _eventBus.Unsubscribe<VesselStateChangedEvent>(VesselStateChangedEvent.GetId(), OnVesselStateChangedEventAsync);
        }

        protected async Task OnChatMessageSentEventAsync(ChatMessageSentEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnGameStateChangedEventAsync(GameStateChangedEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerAddedToVesselRoleEventAsync(PlayerAddedToVesselRoleEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerJoinedGameEventAsync(PlayerJoinedGameEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerLeftGameEventAsync(PlayerLeftGameEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerRemovedFromVesselRoleEventAsync(PlayerRemovedFromVesselRoleEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerSignedInEventAsync(PlayerSignedInEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnPlayerSignedOutEventAsync(PlayerSignedOutEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnVesselMovedInDirectionEventAsync(VesselMovedInDirectionEvent evt) =>
            await OnEventAsync(evt);
        protected async Task OnVesselStateChangedEventAsync(VesselStateChangedEvent evt) =>
            await OnEventAsync(evt);

        private async Task OnEventAsync(IApplicationEvent evt)
        {
            // Lookup all clients that are already in the game and notify them
            var connectionIds = _playerConnections.GetAll();
            foreach(var connectionId in connectionIds)
            {
                var playerId = _playerConnections.GetPlayerId(connectionId);
                var client = _hubContext.Clients.Client(connectionId);
                await client?.SendAsync("IApplicationEvent", evt);
            }
        }

    }
}