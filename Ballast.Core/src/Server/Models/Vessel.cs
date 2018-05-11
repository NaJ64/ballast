using System;

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


    }
}