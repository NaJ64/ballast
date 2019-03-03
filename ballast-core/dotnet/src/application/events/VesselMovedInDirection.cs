using System;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class VesselMovedInDirectionEvent : EventBase, IApplicationEvent  
    {

        public static string GetId() => nameof(VesselMovedInDirectionEvent);
        public override string Id => GetId();

        public Guid GameId { get; private set; }
        public VesselDto Vessel { get; private set; }
        public Direction Direction { get; private set; }

        private VesselMovedInDirectionEvent() { } // For model binding / deserialization
        private VesselMovedInDirectionEvent(string eventDateIsoString, Guid gameId, VesselDto vessel, Direction direction) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
            Direction = direction;
        }

        public static VesselMovedInDirectionEvent FromVesselDirectionInGame(Guid gameId, VesselDto vessel, Direction direction) =>
            new VesselMovedInDirectionEvent(
                EventBase.GetDateIsoString(),
                gameId, 
                vessel,
                direction
            );

    }
}