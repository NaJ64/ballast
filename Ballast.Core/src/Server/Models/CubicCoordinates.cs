using System;

namespace Ballast.Core.Models
{
    public class CubicCoordinates : ICubicCoordinates
    {
        public int X { get; private set; }
        public int Y { get; private set; }
        public int Z { get; private set; }

        private CubicCoordinates(int x, int y, int z)
        {
            if ((x + y + z) != 0)
                throw new Exception("Provided object coordinate(s) do not match constraint 'x + y + z = 0'");
            X = x;
            Y = y;
            Z = z;
        }

        private CubicCoordinates(ICubicCoordinates state) : this(
            x: state.X, 
            y: state.Y, 
            z: state.Z
        ) { }

        public static CubicCoordinates FromProperties(int x, int y, int z) => new CubicCoordinates(
            x: x,
            y: y,
            z: z
        );

        public static CubicCoordinates FromObject(ICubicCoordinates state) => new CubicCoordinates(state);

        public static CubicCoordinates FromAxial(IAxialCoordinates state)
        {
            var y = -1 * (state.X + state.Z);
            return CubicCoordinates.FromProperties(
                x: state.X,
                y: y,
                z: state.Z
            );
        }

        public static CubicCoordinates FromOffset(IOffsetCoordinates state)
        {
            var x = state.Col - (state.Row - (state.Row & 1)) / 2;
            var z = state.Row;
            var y = -1 * (x + z);
            return CubicCoordinates.FromProperties(x: x, y: y, z: z);
        }

        public static CubicCoordinates FromOrderedTriple(int[] orderedTriple)
        {
            if (orderedTriple.Length < 3)
                throw new Exception("Length of ordered pair must be 3 (or greater)");
            var x = orderedTriple[0];
            var y = orderedTriple[1];
            var z = orderedTriple[2];
            return CubicCoordinates.FromProperties(x: x, y: y, z: z);
        }

        public bool Equals(ICubicCoordinates value)
        {
            if (value == null)
                return false;
            return (
                X == value.X &&
                Y == value.Y &&
                Z == value.Z
            );
        }

        public bool EqualsAxial(IAxialCoordinates value) =>
            CubicCoordinates
                .FromAxial(value)
                .Equals(this);

        public bool EqualsOffset(IOffsetCoordinates value) =>
            CubicCoordinates
                .FromOffset(value)
                .Equals(this);

        public AxialCoordinates ToAxial()
        {
            return AxialCoordinates.FromCubic(this);
        }

        public OffsetCoordinates ToOffset()
        {
            return OffsetCoordinates.FromCubic(this);
        }

        public int[] ToOrderedTriple()
        {
            return new int[] { X, Y, Z };
        }

    }

}