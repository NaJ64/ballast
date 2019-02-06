using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;

namespace Ballast.Core.Domain.Events
{
    public class GameStateChangedDomainEvent : EventBase 
    {

        public override string Id => nameof(GameStateChangedDomainEvent);

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