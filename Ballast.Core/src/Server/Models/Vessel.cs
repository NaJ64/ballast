using System;

namespace Ballast.Core.Models
{
    public class Vessel : IVessel
    {

        private readonly CubicCoordinates _cubicCoordinates;

        public Guid Id { get; private set; }
        public ICubicCoordinates CubicCoordinates => _cubicCoordinates;

        private Vessel(Guid id, ICubicCoordinates cubicCoordinates)
        {
            _cubicCoordinates = Models.CubicCoordinates.FromObject(cubicCoordinates);
            Id = id;
        }

        private Vessel(IVessel state) : this(
            id: state.Id,
            cubicCoordinates: state.CubicCoordinates
        ) {}

        public static Vessel FromProperties(Guid id, ICubicCoordinates cubicCoordinates) => new Vessel(
            id: id,
            cubicCoordinates: cubicCoordinates
        );

        public static Vessel FromObject(IVessel state) => new Vessel(state);

    }
}