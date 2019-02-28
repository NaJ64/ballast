using System;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class PlayerJoinedGameEvent : EventBase, IApplicationEvent  
    {

        public static string GetId() => nameof(PlayerJoinedGameEvent);
        public override string Id => GetId();

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
                EventBase.GetDateIsoString(),
                gameId, 
                player
            );

    }
}