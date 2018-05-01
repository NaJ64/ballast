using Ballast.Core.Models.Interfaces;
using System;

namespace Ballast.Core.Models
{
    public class Vessel : IVessel
    {

        public Guid Id { get; private set; }
        public int[] CubicOrderedTriple => CubicCoordinates.ToOrderedTriple();
        public CubicCoordinates CubicCoordinates { get; private set; }

        private Vessel(Guid id, int[] cubicOrderedTriple)
        {
            Id = id;
            CubicCoordinates = CubicCoordinates.FromOrderedTriple(cubicOrderedTriple);
        }

        private Vessel(IVessel state) : this(
            id: state.Id,
            cubicOrderedTriple: state.CubicOrderedTriple
        ) {}

        public static Vessel FromProperties(Guid id, int[] cubicOrderedTriple) => new Vessel(
            id: id,
            cubicOrderedTriple: cubicOrderedTriple
        );

        public static Vessel FromObject(IVessel state) => new Vessel(state);

    }
}