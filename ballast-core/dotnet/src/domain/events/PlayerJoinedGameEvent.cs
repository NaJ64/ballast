using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;
using System.Linq;

namespace Ballast.Core.Domain.Events
{
    public class PlayerJoinedGameDomainEvent : EventBase 
    {

        public override string Id => nameof(PlayerJoinedGameDomainEvent);

        public Guid GameId { get; private set; }
        public Player Player { get; private set; }

        private PlayerJoinedGameDomainEvent(string eventDateIsoString, Guid gameId, Player player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static PlayerJoinedGameDomainEvent FromPlayerInGame(Game game, Player player) =>
            new PlayerJoinedGameDomainEvent(
                EventBase.GetDateIsoString(),
                game.Id, 
                player
            );

    }
}