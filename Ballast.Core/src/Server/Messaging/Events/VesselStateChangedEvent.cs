using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class VesselStateChangedEventState : EventStateBase
    {
        public Guid GameId { get; set; }
        public Vessel Vessel { get; set; }
    }

    public class VesselStateChangedEvent : EventBase 
    {

        public override string Id => nameof(VesselStateChangedEvent);

        public Guid GameId { get; private set; }
        public Vessel Vessel { get; private set; }

        private VesselStateChangedEvent(Guid gameId, Vessel vessel, string isoDateTime = null) : base(isoDateTime) 
        {
            GameId = gameId;
            Vessel = vessel;
        }

        public static implicit operator VesselStateChangedEvent(VesselStateChangedEventState state) =>
            new VesselStateChangedEvent(state.GameId, state.Vessel, state.IsoDateTime);

        public static VesselStateChangedEvent FromVesselInGame(Game game, Vessel vessel) =>
            new VesselStateChangedEvent(game.Id, vessel);

    }

}