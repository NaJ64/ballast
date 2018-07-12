using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{

    public class VesselState
    {
        public Guid Id { get; set; }
        public CubicCoordinates CubicCoordinates { get; set; }
        public Player Captain { get; set; }
        public Player Radioman { get; set; }
    }

    public class Vessel
    {

        public Guid Id { get; private set; }
        public CubicCoordinates CubicCoordinates { get; private set; }
        public Player Captain { get; private set; }
        public Player Radioman { get; private set; }

        private Vessel(Guid id, CubicCoordinates cubicCoordinates, Player captain, Player radioman)
        {
            Id = id;
            CubicCoordinates = cubicCoordinates;
            Captain = captain;
            Radioman = radioman;
        }

        public static Vessel FromProperties(Guid id, CubicCoordinates cubicCoordinates, Player captain, Player radioman) => new Vessel(
            id: id,
            cubicCoordinates: cubicCoordinates,
            captain: captain,
            radioman: radioman
        );

        public static implicit operator Vessel(VesselState state) =>
            new Vessel(state.Id, state.CubicCoordinates, state.Captain, state.Radioman);

        public CubicCoordinates UpdateCoordinates(CubicCoordinates cubicCoordinates)
        {
            CubicCoordinates = cubicCoordinates;
            return CubicCoordinates;
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