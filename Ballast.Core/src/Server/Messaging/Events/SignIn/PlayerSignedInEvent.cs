using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events.SignIn
{
    public class PlayerSignedInEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedInEvent);

        public IPlayer Player { get; private set; } 
        public DateTime TimeStamp { get; private set; }

        public PlayerSignedInEvent(Player player) : base() {
            Player = player;
            TimeStamp = DateTime.UtcNow;
        }

    }
}