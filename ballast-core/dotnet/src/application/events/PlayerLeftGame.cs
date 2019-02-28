using System;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class PlayerLeftGameEvent : EventBase, IApplicationEvent  
    {

        public static string GetId() => nameof(PlayerLeftGameEvent);
        public override string Id => GetId();

        public Guid GameId { get; private set; }
        public PlayerDto Player { get; private set; }

        private PlayerLeftGameEvent() { } // For model binding / deserialization
        private PlayerLeftGameEvent(string eventDateIsoString, Guid gameId, PlayerDto player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static PlayerLeftGameEvent FromPlayerInGame(Guid gameId, PlayerDto player) =>
            new PlayerLeftGameEvent(
                EventBase.GetDateIsoString(),
                gameId, 
                player
            );

    }
}