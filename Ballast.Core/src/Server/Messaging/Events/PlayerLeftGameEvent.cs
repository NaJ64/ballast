using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerLeftGameEventState : EventStateBase
    {
        public Game Game { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerLeftGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameEvent);

        public Game Game { get; private set; }

        private readonly Guid _playerId;
        public Player Player => Game.Players.SingleOrDefault(x => x.Id == _playerId);

        private PlayerLeftGameEvent(Game game, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            Game = game;
            _playerId = player.Id;
        }

        public static implicit operator PlayerLeftGameEvent(PlayerLeftGameEventState state) =>
            new PlayerLeftGameEvent(state.Game, state.Player, state.IsoDateTime);
            
        public static PlayerLeftGameEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerLeftGameEvent(game, player);

    }

}