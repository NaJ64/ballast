using System;

namespace Ballast.Core.Models
{

    public class AxialCoordinatesState
    {
        public int X { get; set; }
        public int Z { get; set; }
    }

    public class AxialCoordinates
    {
        public int X { get; private set; }
        public int Z { get; private set; }

        private AxialCoordinates(int x, int z)
        {
            X = x;
            Z = z;
        }

        public static AxialCoordinates FromProperties(int x, int z) => new AxialCoordinates(
            x: x,
            z: z
        );

        public static AxialCoordinates FromCubic(CubicCoordinates cubic) =>
            new AxialCoordinates(x: cubic.X, z: cubic.Z);

        public static AxialCoordinates FromOffset(OffsetCoordinates offset) =>
            AxialCoordinates.FromCubic(
                CubicCoordinates.FromOffset(offset)
            );

        public static AxialCoordinates FromOrderedPair(int[] orderedPair)
        {
            if (orderedPair.Length < 2)
                throw new Exception("Length of ordered pair must be 2 (or greater)");
            var x = orderedPair[0];
            var z = orderedPair[1];
            return new AxialCoordinates(x, z);
        }

        public bool Equals(AxialCoordinates value)
        {
            if (value == null)
                return false;
            return (
                X == value.X &&
                Z == value.Z
            );
        }

        public bool EqualsCubic(CubicCoordinates cubic) => 
            AxialCoordinates
                .FromCubic(cubic)
                .Equals(this);

        public CubicCoordinates ToCubic() =>  CubicCoordinates.FromAxial(this);

        public OffsetCoordinates ToOffset() => OffsetCoordinates.FromAxial(this);

        public int[] ToOrderedPair() => new int[] { X, Z };

        public static implicit operator AxialCoordinates(AxialCoordinatesState state) =>
            new AxialCoordinates(state.X, state.Z);

    }

}