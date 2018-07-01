using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Vessel : IVessel
    {

        private CubicCoordinates _cubicCoordinates;
        private Player _captain;
        private Player _radioman;

        public Guid Id { get; private set; }
        public ICubicCoordinates CubicCoordinates => _cubicCoordinates;
        public IPlayer Captain => _captain;
        public IPlayer Radioman => _radioman;

        private Vessel(Guid id, ICubicCoordinates cubicCoordinates, IPlayer captain, IPlayer radioman)
        {
            _cubicCoordinates = Models.CubicCoordinates.FromObject(cubicCoordinates);
            _captain = Models.Player.FromObject(captain);
            _radioman = Models.Player.FromObject(radioman);
            Id = id;
        }

        private Vessel(IVessel state) : this(
            id: state.Id,
            cubicCoordinates: state.CubicCoordinates,
            captain: state.Captain,
            radioman: state.Radioman
        ) {}

        public static Vessel FromProperties(Guid id, ICubicCoordinates cubicCoordinates, IPlayer captain, IPlayer radioman) => new Vessel(
            id: id,
            cubicCoordinates: cubicCoordinates,
            captain: captain,
            radioman: radioman
        );

        public static Vessel FromObject(IVessel state) => new Vessel(state);

        public ICubicCoordinates UpdateCoordinates(ICubicCoordinates cubicCoordinates)
        {
            _cubicCoordinates = Models.CubicCoordinates.FromObject(cubicCoordinates);
            return CubicCoordinates;
        }

        public void SetVesselRole(VesselRole vesselRole, Player player)
        {
            if (vesselRole.Equals(VesselRole.Captain))
            {
                _captain = player;
                return;
            }
            if (vesselRole.Equals(VesselRole.Radioman))
            {
                _radioman = player;
                return;
            }
            throw new KeyNotFoundException($"Vessel role matching value '{vesselRole.Value}' does not exist on the current vessel");
        }

        public void RemovePlayer(Player player) 
        {
            if (player == null || player.Id == default(Guid))
                throw new ArgumentNullException(nameof(player.Id));
            if (_captain != null && _captain.Id == player.Id)
                _captain = null;
            if (_radioman != null && _radioman.Id == player.Id)
                _radioman = null;
        }

    }
}