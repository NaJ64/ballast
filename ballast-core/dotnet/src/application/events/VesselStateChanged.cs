using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class VesselStateChangedEvent : EventBase 
    {

        public override string Id => nameof(VesselStateChangedEvent);

        public Guid GameId { get; private set; }
        public VesselDto Player { get; private set; }

        private VesselStateChangedEvent() { } // For model binding / deserialization
        private VesselStateChangedEvent(string eventDateIsoString, Guid gameId, VesselDto vessel) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Player = player;
        }

        public static VesselStateChangedEvent FromVesselInGame(Guid gameId, VesselDto vessel) =>
            new VesselStateChangedEvent(
                EventBase.GetIsoDateString(),
                gameId, 
                player
            );

    }
}