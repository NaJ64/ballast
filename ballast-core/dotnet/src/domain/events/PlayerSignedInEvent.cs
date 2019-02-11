using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerSignedInDomainEvent : EventBase, IDomainEvent 
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