using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class GameStateChangedDomainEvent : EventBase, IDomainEvent
    {

        public static string GetId() => nameof(GameStateChangedDomainEvent);
        public override string Id => GetId();

        public Game Game { get; private set; } 
        
        private GameStateChangedDomainEvent(string eventDateIsoString, Game game) : base(eventDateIsoString)
        {
            Game = game;
        }

        public static GameStateChangedDomainEvent FromGame(Game game) =>
            new GameStateChangedDomainEvent(
                EventBase.GetDateIsoString(),
                game
            );

    }
}