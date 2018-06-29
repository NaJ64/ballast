using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events.Game
{
    public class PlayerJoinedGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerJoinedGameEvent);

        private readonly Guid _playerId;

        public IGame Game { get; private set; }

        public IPlayer Player => Game.Players.SingleOrDefault(x => x.Id == _playerId);

        public PlayerJoinedGameEvent(Models.Game game, Player player) : base() {
            Game = game;
            _playerId = player.Id;
        }

    }

}