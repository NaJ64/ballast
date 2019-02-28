using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerSignedOutDomainEvent : EventBase, IDomainEvent 
    {

        public static string GetId() => nameof(PlayerSignedOutDomainEvent);
        public override string Id => GetId();

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