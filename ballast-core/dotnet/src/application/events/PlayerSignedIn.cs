using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class PlayerSignedInEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedInEvent);

        public PlayerDto Player { get; private set; }

        private PlayerSignedInEvent() { } // For model binding / deserialization
        private PlayerSignedInEvent(string eventDateIsoString, PlayerDto player) : base(eventDateIsoString) 
        {
            Player = player;
        }

        public static PlayerSignedInEvent FromPlayer(PlayerDto player) =>
            new PlayerSignedInEvent(
                EventBase.GetIsoDateString(),
                player
            );

    }
}