using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class VesselStateChangedEventState : EventStateBase
    {
        public Game Game { get; set; }
        public Vessel Vessel { get; set; }
    }

    public class VesselStateChangedEvent : EventBase 
    {

        public override string Id => nameof(VesselStateChangedEvent);

        public Game Game { get; private set; }

        private readonly Guid _vesselId;
        public Vessel Vessel => Game.Vessels.SingleOrDefault(x => x.Id == _vesselId);

        public VesselStateChangedEvent(Game game, Vessel vessel, string isoDateTime = null) : base(isoDateTime) 
        {
            Game = game;
            _vesselId = vessel.Id;
        }

        public static implicit operator VesselStateChangedEvent(VesselStateChangedEventState state) =>
            new VesselStateChangedEvent(state.Game, state.Vessel, state.IsoDateTime);

        public static VesselStateChangedEvent FromVesselInGame(Game game, Vessel vessel) =>
            new VesselStateChangedEvent(game, vessel);

    }

}