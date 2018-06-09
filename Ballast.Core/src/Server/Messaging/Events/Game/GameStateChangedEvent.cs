using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events.Game
{
    public class GameStateChangedEvent : EventBase 
    {

        public override string Id => nameof(GameStateChangedEvent);

        public IGame Game { get; private set; } 

        public GameStateChangedEvent(Models.Game game = null) : base() {
            Game = game;
        }

    }
}