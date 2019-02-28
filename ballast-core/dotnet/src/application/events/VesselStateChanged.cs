using System;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class VesselStateChangedEvent : EventBase, IApplicationEvent  
    {

        public static string GetId() => nameof(VesselStateChangedEvent);
        public override string Id => GetId();

        public Guid GameId { get; private set; }
        public VesselDto Vessel { get; private set; }

        private VesselStateChangedEvent() { } // For model binding / deserialization
        private VesselStateChangedEvent(string eventDateIsoString, Guid gameId, VesselDto vessel) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
        }

        public static VesselStateChangedEvent FromVesselInGame(Guid gameId, VesselDto vessel) =>
            new VesselStateChangedEvent(
                EventBase.GetDateIsoString(),
                gameId, 
                vessel
            );

    }
}