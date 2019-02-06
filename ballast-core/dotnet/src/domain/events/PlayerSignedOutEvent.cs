using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;

namespace Ballast.Core.Domain.Events
{
    public class PlayerSignedOutDomainEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedOutDomainEvent);

        public Player Player { get; private set; } 

        private PlayerSignedOutDomainEvent(string eventDateIsoString, Player player = null) : base(eventDateIsoString) {
            Player = player;
        }

        public static PlayerSignedOutDomainEvent FromPlayer(Player player = null) =>
            new PlayerSignedOutDomainEvent(
                EventBase.GetDateIsoString(),
                player
            );

    }
}