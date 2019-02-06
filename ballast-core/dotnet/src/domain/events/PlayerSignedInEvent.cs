using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;

namespace Ballast.Core.Domain.Events
{
    public class PlayerSignedInDomainEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedInDomainEvent);

        public Player Player { get; private set; } 

        private PlayerSignedInDomainEvent(string eventDateIsoString, Player player) : base(eventDateIsoString) {
            Player = player;
        }

        public static PlayerSignedInDomainEvent FromPlayer(Player player) =>
            new PlayerSignedInDomainEvent(
                EventBase.GetDateIsoString(),
                player
            );

            
    }

}