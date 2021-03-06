using System;
using Ballast.Core.Domain.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Domain.Events
{
    public class PlayerRemovedFromVesselRoleDomainEvent : EventBase, IDomainEvent 
    {

        public static string GetId() => nameof(PlayerRemovedFromVesselRoleDomainEvent);
        public override string Id => GetId();

        public Guid GameId { get; private set; }
        public Vessel Vessel { get; private set; }
        public VesselRole VesselRole { get; private set; }
        public Player Player { get; private set; }

        private PlayerRemovedFromVesselRoleDomainEvent(string eventDateIsoString, Guid gameId, Vessel vessel, VesselRole vesselRole, Player player) : base(eventDateIsoString) 
        {
            GameId = gameId;
            Vessel = vessel;
            VesselRole = vesselRole;
            Player = player;
        }
        
        public static PlayerRemovedFromVesselRoleDomainEvent FromPlayerInGameVesselRole(Game game, Vessel vessel, VesselRole vesselRole, Player player) =>
            new PlayerRemovedFromVesselRoleDomainEvent(
                EventBase.GetDateIsoString(),
                game.Id, 
                vessel, 
                vesselRole, 
                player
            );

    }
}