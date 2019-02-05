using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class PlayerSignedOutEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedOutEvent);

        public PlayerDto Player { get; private set; }

        private PlayerSignedOutEvent() { } // For model binding / deserialization
        private PlayerSignedOutEvent(string eventDateIsoString, PlayerDto player = null) : base(eventDateIsoString) 
        {
            Player = player;
        }

        public static PlayerSignedOutEvent FromPlayer(PlayerDto player = null) =>
            new PlayerSignedOutEvent(
                EventBase.GetIsoDateString(),
                player
            );

    }
}