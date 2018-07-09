using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerRemovedFromVesselRoleEventState : EventStateBase
    {
        public Guid GameId { get; set; }
        public Vessel Vessel { get; set; }
        public VesselRole VesselRole { get; set; }
        public Player Player { get; set; }
    }

    public class PlayerRemovedFromVesselRoleEvent : EventBase 
    {

        public override string Id => nameof(PlayerRemovedFromVesselRoleEvent);

        public Guid GameId { get; private set; }
        public Vessel Vessel { get; private set; }
        public VesselRole VesselRole { get; private set; }
        public Player Player { get; private set; }

        private PlayerRemovedFromVesselRoleEvent(Guid gameId, Vessel vessel, VesselRole vesselRole, Player player, string isoDateTime = null) : base(isoDateTime) 
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }

        public static implicit operator PlayerRemovedFromVesselRoleEvent(PlayerRemovedFromVesselRoleEventState state) =>
            new PlayerRemovedFromVesselRoleEvent(state.GameId, state.Vessel, state.VesselRole, state.Player, state.IsoDateTime);
            
        public static PlayerRemovedFromVesselRoleEvent FromPlayerInGameVesselRole(Game game, Vessel vessel, VesselRole vesselRole, Player player) =>
            new PlayerRemovedFromVesselRoleEvent(game.Id, vessel, vesselRole, player);

    }

}