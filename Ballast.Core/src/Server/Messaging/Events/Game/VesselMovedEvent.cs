using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events.Game
{
    public class VesselMovedEvent : EventBase {

        public override string Id => nameof(VesselMovedEvent);

        private readonly Guid vesselId;

        public readonly IGame Game; 

        public IVessel Vessel => Game.Vessels.SingleOrDefault(x => x.Id == vesselId);

        public VesselMovedEvent(Models.Game game, Vessel vessel) : base() {
            Game = game;
            vesselId = vessel.Id;
        }

    }

}