using System;
using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerAddedToVesselRoleDomainEvent : EventBase 
    {

        public override string Id => nameof(PlayerAddedToVesselRoleDomainEvent);

        public Guid GameId { get; private set; }
        public Vessel Vessel { get; private set; }
        public VesselRole VesselRole { get; private set; }
        public Player Player { get; private set; }

        private PlayerAddedToVesselRoleDomainEvent(string eventDateIsoString, Guid gameId, Vessel vessel, VesselRole vesselRole, Player player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }

        public static PlayerAddedToVesselRoleDomainEvent FromPlayerInGameVesselRole(Game game, Vessel vessel, VesselRole vesselRole, Player player) =>
            new PlayerAddedToVesselRoleDomainEvent(
                EventBase.GetDateIsoString(),
                game.Id, 
                vessel, 
                vesselRole, 
                player
            );

    }
}