using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerJoinedGameEventState : EventStateBase
    {
        public Guid GameId { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerJoinedGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerJoinedGameEvent);

        public Guid GameId { get; private set; }
        public Player Player { get; private set; }

        private PlayerJoinedGameEvent(Guid gameId, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            GameId = gameId;
            Player = player;
        }

        public static implicit operator PlayerJoinedGameEvent(PlayerJoinedGameEventState state) =>
            new PlayerJoinedGameEvent(state.GameId, state.Player, state.IsoDateTime);
            
        public static PlayerJoinedGameEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerJoinedGameEvent(game.Id, player);

    }

}