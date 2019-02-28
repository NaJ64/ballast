using System;

namespace Ballast.Core.Domain.Models
{
    public class CubicCoordinates
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

        public static CubicCoordinates FromAxial(AxialCoordinates axial)
        {
            var y = -1 * (axial.X + axial.Z);
            return new CubicCoordinates(
                x: axial.X,
                y: y,
                z: axial.Z
            );
        }

        public static CubicCoordinates FromOffset(OffsetCoordinates offset)
        {
            var x = offset.Col - (offset.Row - (offset.Row & 1)) / 2;
            var z = offset.Row;
            var y = -1 * (x + z);
            return new CubicCoordinates(x: x, y: y, z: z);
        }

        public static CubicCoordinates FromOrderedTriple(int[] orderedTriple)
        {
            if (orderedTriple.Length < 3)
                throw new Exception("Length of ordered pair must be 3 (or greater)");
            var x = orderedTriple[0];
            var y = orderedTriple[1];
            var z = orderedTriple[2];
            return new CubicCoordinates(x, y, z);
        }

        public bool Equals(CubicCoordinates cubic)
        {
            if (cubic == null)
                return false;
            return (
                X == cubic.X &&
                Y == cubic.Y &&
                Z == cubic.Z
            );
        }

        public bool EqualsAxial(AxialCoordinates axial) =>
            CubicCoordinates
                .FromAxial(axial)
                .Equals(this);

        public bool EqualsOffset(OffsetCoordinates offset) =>
            CubicCoordinates
                .FromOffset(offset)
                .Equals(this);

        public AxialCoordinates ToAxial() => AxialCoordinates.FromCubic(this);

        public OffsetCoordinates ToOffset() => OffsetCoordinates.FromCubic(this);

        public int[] ToOrderedTriple() => new int[] { X, Y, Z };

        public CubicCoordinates AddXSubtractY(int units) => // Right
            new CubicCoordinates( 
                x: X + units,
                y: Y - units,
                z: Z
            );

        public CubicCoordinates AddXSubtractZ(int units) => // Right + Up
            new CubicCoordinates(
                x: X + units,
                y: Y,
                z: Z - units
            );

        public CubicCoordinates AddYSubtractX(int units) => // Left
            new CubicCoordinates(
                x: X - units,
                y: Y + units,
                z: Z
            );

        public CubicCoordinates AddYSubtractZ(int units) => // Left + Up
            new CubicCoordinates(
                x: X,
                y: Y + units,
                z: Z - units
            );

        public CubicCoordinates AddZSubtractX(int units) => // Left + Down
            new CubicCoordinates(
                x: X - units,
                y: Y,
                z: Z + units
            );

        public CubicCoordinates AddZSubtractY(int units) => // Right + Down
            new CubicCoordinates(
                x: X,
                y: Y - units,
                z: Z + units
            );

    }

}