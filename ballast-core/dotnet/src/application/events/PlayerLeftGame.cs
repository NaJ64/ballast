using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class PlayerLeftGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameEvent);

        public Guid GameId { get; private set; }
        public PlayerDto Player { get; private set; }

        private PlayerLeftGameEvent() { } // For model binding / deserialization
        private PlayerLeftGameEvent(string eventDateIsoString, Guid gameId, Player player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static PlayerLeftGameEvent FromPlayerInGame(Guid gameId, PlayerDto player) =>
            new PlayerLeftGameEvent(
                EventBase.GetIsoDateString(),
                gameId, 
                player
            );

    }
}