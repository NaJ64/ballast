using System;
using System.Collections.Generic;

namespace Ballast.Core.Domain.Models
{
    public class Vessel
    {

        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public CubicCoordinates CubicCoordinates { get; private set; }
        public Player Captain { get; private set; }
        public Player Radioman { get; private set; }

        public Vessel(Guid id, string name, CubicCoordinates cubicCoordinates, Player captain, Player radioman)
        {
            Id = id;
            Name = name;
            CubicCoordinates = cubicCoordinates;
            Captain = captain;
            Radioman = radioman;
        }

        public CubicCoordinates UpdateCoordinates(CubicCoordinates cubicCoordinates)
        {
            CubicCoordinates = cubicCoordinates;
            return CubicCoordinates;
        }

        public void UpdateName(string name)
        {
            Name = name;
        }

        public void SetVesselRole(VesselRole vesselRole, Player player)
        {
            if (vesselRole.Equals(VesselRole.Captain))
            {
                Captain = player;
                return;
            }
            if (vesselRole.Equals(VesselRole.Radioman))
            {
                Radioman = player;
                return;
            }
            throw new KeyNotFoundException($"Vessel role matching value '{vesselRole.Value}' does not exist on the current vessel");
        }

        public void RemovePlayer(Player player) 
        {
            if (player == null || player.Id == default(Guid))
                throw new ArgumentNullException(nameof(player.Id));
            if (Captain != null && Captain.Id == player.Id)
                Captain = null;
            if (Radioman != null && Radioman.Id == player.Id)
                Radioman = null;
        }

    }
}