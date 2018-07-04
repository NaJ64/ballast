using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events
{
    public class PlayerSignedOutEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedOutEvent);

        public IPlayer Player { get; private set; } 
        public DateTime TimeStamp { get; private set; }

        public PlayerSignedOutEvent(Player player) : base() {
            Player = player;
            TimeStamp = DateTime.UtcNow;
        }

    }
}