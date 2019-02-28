using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerSignedInDomainEvent : EventBase, IDomainEvent 
    {

        public static string GetId() => nameof(PlayerSignedInDomainEvent);
        public override string Id => GetId();

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