using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class PlayerJoinedGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerJoinedGameEvent);

        public Guid GameId { get; private set; }
        public PlayerDto Player { get; private set; }

        private PlayerJoinedGameEvent() { } // For model binding / deserialization
        private PlayerJoinedGameEvent(string eventDateIsoString, Guid gameId, PlayerDto player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static PlayerJoinedGameEvent FromPlayerInGame(Guid gameId, PlayerDto player) =>
            new PlayerJoinedGameEvent(
                EventBase.GetIsoDateString(),
                gameId, 
                player
            );

    }
}