using Ballast.Core.Models.Interfaces;
using System;

namespace Ballast.Core.Models
{
    public class AxialCoordinates : IAxialCoordinates
    {
        public int X { get; private set; }
        public int Z { get; private set; }

        private AxialCoordinates(int x, int z)
        {
            X = x;
            Z = z;
        }

        private AxialCoordinates(IAxialCoordinates state) : this(
            x: state.X, 
            z: state.Z
        ) { }

        public static AxialCoordinates FromProperties(int x, int z) => new AxialCoordinates(
            x: x,
            z: z
        );

        public static AxialCoordinates FromObject(IAxialCoordinates state) =>
            new AxialCoordinates(state);

        public static AxialCoordinates FromCubic(ICubicCoordinates state) =>
            AxialCoordinates.FromObject(state);

        public static AxialCoordinates FromOffset(IOffsetCoordinates state) =>
            AxialCoordinates.FromCubic(
                CubicCoordinates.FromOffset(state)
            );

        public static AxialCoordinates FromOrderedPair(int[] orderedPair)
        {
            if (orderedPair.Length < 2)
                throw new Exception("Length of ordered pair must be 2 (or greater)");
            var x = orderedPair[0];
            var z = orderedPair[1];
            return AxialCoordinates.FromProperties(x: x, z: z);
        }

        public bool Equals(IAxialCoordinates value)
        {
            if (value == null)
                return false;
            return (
                X == value.X &&
                Z == value.Z
            );
        }

        public bool EqualsCubic(ICubicCoordinates state) => 
            AxialCoordinates
                .FromCubic(state)
                .Equals(this);

        public CubicCoordinates ToCubic() =>  CubicCoordinates.FromAxial(this);

        public OffsetCoordinates ToOffset() => OffsetCoordinates.FromAxial(this);

        public int[] ToOrderedPair() => new int[] { X, Z };

    }
}