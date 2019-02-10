using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class PlayerSignedOutEvent : EventBase 
    {

        public static string GetId() => nameof(PlayerSignedOutEvent);
        public override string Id => GetId();

        public PlayerDto Player { get; private set; }

        private PlayerSignedOutEvent() { } // For model binding / deserialization
        private PlayerSignedOutEvent(string eventDateIsoString, PlayerDto player = null) : base(eventDateIsoString) 
        {
            Player = player;
        }

        public static PlayerSignedOutEvent FromPlayer(PlayerDto player = null) =>
            new PlayerSignedOutEvent(
                EventBase.GetDateIsoString(),
                player
            );

    }
}