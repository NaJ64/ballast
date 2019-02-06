using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;
using System;
using System.Linq;

namespace Ballast.Core.Domain.Events
{
    public class VesselStateChangedDomainEvent : EventBase 
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