using Ballast.Core.Messaging;
using Ballast.Core.Messaging.Events.SignIn;
using Ballast.Core.Models;
using Ballast.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class SignInService : ISignInService
    {

        private readonly IEventBus _eventBus;
        private readonly IDictionary<Guid, Player> _players;

        public SignInService(IEventBus eventBus)
        {
            _eventBus = eventBus;
            _players = new Dictionary<Guid, Player>();
        }

        public void Dispose() 
        { 
            _players.Clear();
        }

        public async Task<IPlayer> SignInAsync(PlayerSignInRequest request)
        {
            var playerIdString = request?.PlayerId ?? throw new ArgumentNullException(nameof(request.PlayerId));
            var playerId = Guid.Parse(playerIdString);
            var playerName = request?.PlayerName ?? GetTempPlayerName();
            if (!_players.ContainsKey(playerId))
            {
                var player = Player.FromProperties(
                    id: playerId,
                    name: playerName
                );
                _players.Add(playerId, player);
                await _eventBus.PublishAsync(new PlayerSignedInEvent(player));
            }
            return _players[playerId];
        }

        public async Task SignOutAsync(PlayerSignOutRequest request)
        {
            var playerIdString = request?.PlayerId ?? throw new ArgumentNullException(nameof(request.PlayerId));
            var playerId = Guid.Parse(playerIdString);
            if (!_players.ContainsKey(playerId))
                throw new KeyNotFoundException($"Player id not found ({playerId})");
            var player = _players[playerId];
            _players.Remove(playerId);
            await _eventBus.PublishAsync(new PlayerSignedOutEvent(player));
        }

        public async Task<IPlayer> GetSignedInPlayerAsync(Guid playerId)
        {
            if (playerId.Equals(Guid.Empty))
                throw new ArgumentNullException(nameof(playerId));
            if (!_players.ContainsKey(playerId))
                return null;
            return await Task.FromResult(_players[playerId]);
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