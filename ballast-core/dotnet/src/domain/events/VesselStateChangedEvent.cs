using System;
using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class VesselStateChangedDomainEvent : EventBase, IDomainEvent 
    {

        public override string Id => nameof(VesselStateChangedDomainEvent);

        public Guid GameId { get; private set; }
        public Vessel Vessel { get; private set; }

        private VesselStateChangedDomainEvent(string eventDateIsoString, Guid gameId, Vessel vessel) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
        }

        public static VesselStateChangedDomainEvent FromVesselInGame(Game game, Vessel vessel) =>
            new VesselStateChangedDomainEvent(
                EventBase.GetDateIsoString(),
                game.Id, 
                vessel
            );

    }
}