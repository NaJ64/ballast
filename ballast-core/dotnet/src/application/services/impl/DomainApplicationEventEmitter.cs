using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Models;
using Ballast.Core.Domain.Events;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Services.Impl
{
    public class DomainApplicationEventEmitter : IApplicationEventEmitter
    {

        private readonly IEventBus _eventBus;
        private bool _isEnabled;

        public DomainApplicationEventEmitter(IEventBus eventBus)
        {
            _eventBus = eventBus;
            _isEnabled = false;
            SubscribeAll();
        }

        public void Dispose() 
        {
            _isEnabled = false; 
            UnsubscribeAll();
        }

        public bool IsEnabled => _isEnabled;

        public void Start()
        {
            _isEnabled = true;
        }

        public void Stop()
        {
            _isEnabled = false;
        }

        private void SubscribeAll()
        {
            _eventBus.Subscribe<GameStateChangedDomainEvent>(GameStateChangedDomainEvent.GetId(), 
                OnGameStateChangedDomainEventAsync);
            _eventBus.Subscribe<PlayerAddedToVesselRoleDomainEvent>(PlayerAddedToVesselRoleDomainEvent.GetId(), 
                OnPlayerAddedToVesselRoleDomainEventAsync);
            _eventBus.Subscribe<PlayerJoinedGameDomainEvent>(PlayerJoinedGameDomainEvent.GetId(), 
                OnPlayerJoinedGameDomainEventAsync);
            _eventBus.Subscribe<PlayerLeftGameDomainEvent>(PlayerLeftGameDomainEvent.GetId(), 
                OnPlayerLeftGameDomainEventAsync);
            _eventBus.Subscribe<PlayerRemovedFromVesselRoleDomainEvent>(PlayerRemovedFromVesselRoleDomainEvent.GetId(), 
                OnPlayerRemovedFromVesselRoleDomainEventAsync);
            _eventBus.Subscribe<PlayerSignedInDomainEvent>(PlayerSignedInDomainEvent.GetId(), 
                OnPlayerSignedInDomainEventAsync);
            _eventBus.Subscribe<PlayerSignedOutDomainEvent>(PlayerSignedOutDomainEvent.GetId(), 
                OnPlayerSignedOutDomainEventAsync);
            _eventBus.Subscribe<VesselStateChangedDomainEvent>(VesselStateChangedDomainEvent.GetId(), 
                OnVesselStateChangedDomainEventAsync);
        }

        private void UnsubscribeAll()
        {
            _eventBus.Unsubscribe<GameStateChangedDomainEvent>(GameStateChangedDomainEvent.GetId(), 
                OnGameStateChangedDomainEventAsync);
            _eventBus.Unsubscribe<PlayerAddedToVesselRoleDomainEvent>(PlayerAddedToVesselRoleDomainEvent.GetId(), 
                OnPlayerAddedToVesselRoleDomainEventAsync);
            _eventBus.Unsubscribe<PlayerJoinedGameDomainEvent>(PlayerJoinedGameDomainEvent.GetId(), 
                OnPlayerJoinedGameDomainEventAsync);
            _eventBus.Unsubscribe<PlayerLeftGameDomainEvent>(PlayerLeftGameDomainEvent.GetId(), 
                OnPlayerLeftGameDomainEventAsync);
            _eventBus.Unsubscribe<PlayerRemovedFromVesselRoleDomainEvent>(PlayerRemovedFromVesselRoleDomainEvent.GetId(), 
                OnPlayerRemovedFromVesselRoleDomainEventAsync);
            _eventBus.Unsubscribe<PlayerSignedInDomainEvent>(PlayerSignedInDomainEvent.GetId(), 
                OnPlayerSignedInDomainEventAsync);
            _eventBus.Unsubscribe<PlayerSignedOutDomainEvent>(PlayerSignedOutDomainEvent.GetId(), 
                OnPlayerSignedOutDomainEventAsync);
            _eventBus.Unsubscribe<VesselStateChangedDomainEvent>(VesselStateChangedDomainEvent.GetId(), 
                OnVesselStateChangedDomainEventAsync);
        }

        private Task PublishIfEnabledAsync<TEvent>(TEvent evt) where TEvent : IApplicationEvent
        {
            if (!_isEnabled) // TODO: Make it so we don't even create application events if the flag is false
                return Task.CompletedTask; 
            return _eventBus.PublishAsync(evt);
        }

        private Task OnGameStateChangedDomainEventAsync(GameStateChangedDomainEvent evt)
        {
            var gameDto = DomainGameService.MapToGameDto(evt.Game);
            return PublishIfEnabledAsync(GameStateChangedEvent.FromGame(gameDto));
        }

        private Task OnPlayerAddedToVesselRoleDomainEventAsync(PlayerAddedToVesselRoleDomainEvent evt)
        {
            var vesselDto = DomainGameService.MapToVesselDto(evt.Vessel);
            var playerDto = DomainGameService.MapToPlayerDto(evt.Player);
            return PublishIfEnabledAsync(PlayerAddedToVesselRoleEvent.FromPlayerInGameVesselRole(
                evt.GameId,
                vesselDto,
                evt.VesselRole.Name,
                playerDto
            ));
        }

        private Task OnPlayerJoinedGameDomainEventAsync(PlayerJoinedGameDomainEvent evt)
        {
            var playerDto = DomainGameService.MapToPlayerDto(evt.Player);
            return PublishIfEnabledAsync(PlayerJoinedGameEvent.FromPlayerInGame(
                evt.GameId,
                playerDto
            ));
        }

        private Task OnPlayerLeftGameDomainEventAsync(PlayerLeftGameDomainEvent evt)
        {
            var playerDto = DomainGameService.MapToPlayerDto(evt.Player);
            return PublishIfEnabledAsync(PlayerLeftGameEvent.FromPlayerInGame(
                evt.GameId,
                playerDto
            ));
        }

        private Task OnPlayerRemovedFromVesselRoleDomainEventAsync(PlayerRemovedFromVesselRoleDomainEvent evt)
        {
            var vesselDto = DomainGameService.MapToVesselDto(evt.Vessel);
            var playerDto = DomainGameService.MapToPlayerDto(evt.Player);
            return PublishIfEnabledAsync(PlayerRemovedFromVesselRoleEvent.FromPlayerInGameVesselRole(
                evt.GameId,
                vesselDto,
                evt.VesselRole.Name,
                playerDto
            ));
        }

        private Task OnPlayerSignedInDomainEventAsync(PlayerSignedInDomainEvent evt)
        {
            var playerDto = DomainGameService.MapToPlayerDto(evt.Player);
            return PublishIfEnabledAsync(PlayerSignedInEvent.FromPlayer(
                playerDto
            ));
        }

        private Task OnPlayerSignedOutDomainEventAsync(PlayerSignedOutDomainEvent evt)
        {
            var playerDto = evt.Player != null ? DomainGameService.MapToPlayerDto(evt.Player) : null;
            return PublishIfEnabledAsync(PlayerSignedOutEvent.FromPlayer(
                playerDto
            ));
        }

        private Task OnVesselStateChangedDomainEventAsync(VesselStateChangedDomainEvent evt)
        {
            var vesselDto = DomainGameService.MapToVesselDto(evt.Vessel);
            return PublishIfEnabledAsync(VesselStateChangedEvent.FromVesselInGame(
                evt.GameId,
                vesselDto
            ));
        }

    }
}