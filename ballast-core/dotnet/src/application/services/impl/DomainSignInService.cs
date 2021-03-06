using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Domain.Events;
using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Services.Impl
{
    public class DomainSignInService : ISignInService
    {

        private readonly IEventBus _eventBus;
        private readonly IDictionary<Guid, Player> _players;

        public DomainSignInService(IEventBus eventBus)
        {
            _eventBus = eventBus;
            _players = new Dictionary<Guid, Player>();
        }

        public void Dispose() 
        { 
            _players.Clear();
        }

        public static PlayerDto MapToPlayerDto(Player player) => new PlayerDto()
        {
            Id = player.Id,
            Name = player.Name
        };

        public async Task<PlayerDto> SignInAsync(PlayerSignInRequest request)
        {
            var playerId = request?.PlayerId ?? throw new ArgumentNullException(nameof(request.PlayerId));
            var playerName = request?.PlayerName ?? GetTempPlayerName();
            if (!_players.ContainsKey(playerId))
            {
                var player = new Player(
                    id: playerId,
                    name: playerName
                );
                _players.Add(playerId, player);
                await _eventBus.PublishAsync(PlayerSignedInDomainEvent.FromPlayer(player));
            }
            return MapToPlayerDto(_players[playerId]);
        }

        public async Task SignOutAsync(PlayerSignOutRequest request)
        {
            var playerId = request?.PlayerId ?? throw new ArgumentNullException(nameof(request.PlayerId));
            if (!_players.ContainsKey(playerId))
                throw new KeyNotFoundException($"Player id not found ({playerId})");
            var player = _players[playerId];
            _players.Remove(playerId);
            await _eventBus.PublishAsync(PlayerSignedOutDomainEvent.FromPlayer(player));
        }

        public Task<PlayerDto> GetSignedInPlayerAsync(Guid playerId)
        {
            if (playerId.Equals(Guid.Empty))
                throw new ArgumentNullException(nameof(playerId));
            if (!_players.ContainsKey(playerId))
                return null;
            return Task.FromResult(MapToPlayerDto(_players[playerId]));
        }
        
        private string GetTempPlayerName()
        {
            var index = 1;
            var playerName = $"Player{index}";
            while(_players.Values.Any(x => 
                !String.IsNullOrEmpty(x?.Name) && 
                playerName.ToLowerInvariant().Equals(x?.Name?.ToLowerInvariant()))
            )
            {
                index++;
                playerName = $"Player{index}";
            }
            return playerName;
        }

    }
}