using Ballast.Core.Application.Models;
using System;
using System.Linq;

namespace Ballast.Core.Application.Events
{
    public class PlayerLeftGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameEvent);

        public Guid GameId { get; private set; }
        public VesselDto Vessel { get; private set; }
        public string VesselRole { get; private set; }
        public PlayerDto Player { get; private set; }

        private PlayerLeftGameEvent() { } // For model binding / deserialization
        private PlayerLeftGameEvent(string eventDateIsoString, Guid gameId, VesselDto vessel, string vesselRole, PlayerDto player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }

        public static PlayerLeftGameEvent FromPlayerInGameVesselRole(Guid gameId, VesselDto vessel, string vesselRole, PlayerDto player) =>
            new PlayerLeftGameEvent(
                EventBase.GetIsoDateString(),
                gameId, 
                vessel,
                vesselRole,
                player
            );

    }
}