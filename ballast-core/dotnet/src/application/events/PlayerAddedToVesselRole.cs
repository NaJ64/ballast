using System;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class PlayerAddedToVesselRoleEvent : EventBase, IApplicationEvent 
    {

        public static string GetId() => nameof(PlayerAddedToVesselRoleEvent);
        public override string Id => GetId();

        public Guid GameId { get; private set; }
        public VesselDto Vessel { get; private set; }
        public string VesselRole { get; private set; }
        public PlayerDto Player { get; private set; }

        private PlayerAddedToVesselRoleEvent() { } // For model binding / deserialization
        private PlayerAddedToVesselRoleEvent(string eventDateIsoString, Guid gameId, VesselDto vessel, string vesselRole, PlayerDto player) : base(eventDateIsoString)
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }

        public static PlayerAddedToVesselRoleEvent FromPlayerInGameVesselRole(Guid gameId, VesselDto vessel, string vesselRole, PlayerDto player) =>
            new PlayerAddedToVesselRoleEvent(
                EventBase.GetDateIsoString(),
                gameId, 
                vessel, 
                vesselRole, 
                player
            );

    }
}