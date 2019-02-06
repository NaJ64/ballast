using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;
using System.Linq;

namespace Ballast.Core.Domain.Events
{
    public class PlayerLeftGameDomainEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameDomainEvent);

        public Guid GameId { get; private set; }
        public Player Player { get; set;}

        private PlayerLeftGameDomainEvent(string eventDateIsoString, Guid gameId, Player player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static PlayerLeftGameDomainEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerLeftGameDomainEvent(
                EventBase.GetDateIsoString(),
                game.Id, 
                player
            );

    }

}