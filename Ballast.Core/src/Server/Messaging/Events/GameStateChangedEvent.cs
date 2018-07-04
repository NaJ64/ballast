using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events
{

    public class GameStateChangedEventState : EventStateBase
    {
        public Game Game { get; set; }
    }

    public class GameStateChangedEvent : EventBase 
    {

        public override string Id => nameof(GameStateChangedEvent);

        public Game Game { get; private set; } 
        
        private GameStateChangedEvent(Game game, string isoDateTime = null) : base(isoDateTime)
        {
            Game = game;
        }

        public static implicit operator GameStateChangedEvent(GameStateChangedEventState state) =>
            new GameStateChangedEvent(state.Game, state.IsoDateTime);

        public static GameStateChangedEvent FromGame(Game game) =>
            new GameStateChangedEvent(game);

    }
}