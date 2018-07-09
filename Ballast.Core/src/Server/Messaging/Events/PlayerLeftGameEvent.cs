using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerLeftGameEventState : EventStateBase
    {
        public Guid GameId { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerLeftGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameEvent);

        public Guid GameId { get; private set; }
        public Player Player { get; set;}

        private PlayerLeftGameEvent(Guid gameId, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            GameId = gameId;
            Player = player;
        }

        public static implicit operator PlayerLeftGameEvent(PlayerLeftGameEventState state) =>
            new PlayerLeftGameEvent(state.GameId, state.Player, state.IsoDateTime);
            
        public static PlayerLeftGameEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerLeftGameEvent(game.Id, player);

    }

}