using System;
using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerJoinedGameDomainEvent : EventBase, IDomainEvent 
    {

        public static string GetId() => nameof(PlayerJoinedGameDomainEvent);
        public override string Id => GetId();

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