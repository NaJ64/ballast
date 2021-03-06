using System;

namespace Ballast.Core.Domain.Models
{
    public class OffsetCoordinates
    {

        public int Row { get; private set; }
        public int Col { get; private set; }

        public OffsetCoordinates(int col, int row) 
        {
            Col = col;
            Row = row;        
        }

        public static OffsetCoordinates FromAxial(AxialCoordinates axial) 
        {
            // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
            var col = axial.X + (axial.Z - (axial.Z & 1)) / 2;
            var row = axial.Z;
            return new OffsetCoordinates(col: col, row: row);
        }
        
        public static OffsetCoordinates FromCubic(CubicCoordinates cubic) =>
            OffsetCoordinates.FromAxial(
                AxialCoordinates.FromCubic(cubic)
            );
        
        public static OffsetCoordinates FromOrderedPair(int[] orderedPair) {
            if (orderedPair.Length < 2)
                throw new Exception("Length of ordered pair must be 2 (or greater)");
                var col = orderedPair[0]; // x
                var row = orderedPair[1]; // z
            return new OffsetCoordinates(col: col, row: row);
        }

        public AxialCoordinates ToAxial() => AxialCoordinates.FromOffset(this);

        public CubicCoordinates ToCubic() => CubicCoordinates.FromOffset(this);

        public int[] ToOrderedPair() => new int[] { Col, Row };

    }
}