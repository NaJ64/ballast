using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events.Game
{
    public class VesselStateChangedEvent : EventBase 
    {

        public override string Id => nameof(VesselStateChangedEvent);

        private readonly Guid vesselId;

        public IGame Game { get; private set; }

        public IVessel Vessel => Game.Vessels.SingleOrDefault(x => x.Id == vesselId);

        public VesselStateChangedEvent(Models.Game game, Vessel vessel) : base() {
            Game = game;
            vesselId = vessel.Id;
        }

    }

}