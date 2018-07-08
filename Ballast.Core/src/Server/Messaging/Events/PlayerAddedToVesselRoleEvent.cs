using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerAddedToVesselRoleEventState : EventStateBase
    {
        public Guid GameId { get; set; }
        public Vessel Vessel { get; set; }
        public VesselRole VesselRole { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerAddedToVesselRoleEvent : EventBase 
    {

        public override string Id => nameof(PlayerAddedToVesselRoleEvent);

        public Guid GameId { get; private set; }
        public VesselRole VesselRole { get; private set; }
        public Vessel Vessel { get; private set; }
        public Player Player { get; private set; }

        private PlayerAddedToVesselRoleEvent(Guid gameId, Vessel vessel, VesselRole vesselRole, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }

        public static implicit operator PlayerAddedToVesselRoleEvent(PlayerAddedToVesselRoleEventState state) =>
            new PlayerAddedToVesselRoleEvent(state.GameId, state.Vessel, state.VesselRole, state.Player, state.IsoDateTime);
            
        public static PlayerAddedToVesselRoleEvent FromPlayerInGameVesselRole(Game game, Vessel vessel, VesselRole vesselRole, Player player) =>
            new PlayerAddedToVesselRoleEvent(game.Id, vessel, vesselRole, player);

    }

}