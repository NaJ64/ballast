using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerJoinedGameEventState : EventStateBase
    {
        public Game Game { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerJoinedGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerJoinedGameEvent);

        public Game Game { get; private set; }

        private readonly Guid _playerId;
        public Player Player => Game.Players.SingleOrDefault(x => x.Id == _playerId);

        private PlayerJoinedGameEvent(Game game, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            Game = game;
            _playerId = player.Id;
        }

        public static implicit operator PlayerJoinedGameEvent(PlayerJoinedGameEventState state) =>
            new PlayerJoinedGameEvent(state.Game, state.Player, state.IsoDateTime);
            
        public static PlayerJoinedGameEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerJoinedGameEvent(game, player);

    }

}