using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events.Game
{
    public class GameStateChangedEvent : EventBase {

        public override string Id => nameof(GameStateChangedEvent);

        public readonly Models.Game Game; 

        public GameStateChangedEvent(Models.Game game) : base() {
            Game = game;
        }

    }
}