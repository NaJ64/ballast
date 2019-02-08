using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class GameStateChangedEvent : EventBase 
    {

        public override string Id => nameof(GameStateChangedEvent);

        public GameDto Game { get; private set; } 

        private GameStateChangedEvent() { } // For model binding / deserialization
        private GameStateChangedEvent(string eventDateIsoString, GameDto game) : base(eventDateIsoString)
        {
            Game = game;
        }

        public static GameStateChangedEvent FromGame(GameDto game) =>
            new GameStateChangedEvent(EventBase.GetDateIsoString(), game);

    }
}