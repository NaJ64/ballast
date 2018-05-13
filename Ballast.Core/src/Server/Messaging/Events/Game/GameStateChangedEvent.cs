using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events.Game
{
    public class GameStateChangedEvent : EventBase {

        public override string Id => nameof(GameStateChangedEvent);

        public readonly IGame Game; 

        public GameStateChangedEvent(Models.Game game = null) : base() {
            Game = game;
        }

    }
}