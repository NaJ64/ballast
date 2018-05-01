using Ballast.Core.Models.Interfaces;
using System;

namespace Ballast.Core.Models
{
    public class OffsetCoordinates : IOffsetCoordinates
    {

        public int Row { get; private set; }
        public int Col { get; private set; }

        private OffsetCoordinates(int col, int row) 
        {
            Col = col;
            Row = row;        
        }

        private OffsetCoordinates(IOffsetCoordinates state): this(
            col: state.Col,
            row: state.Row
        ) { }

        public static OffsetCoordinates FromObject(IOffsetCoordinates state) => new OffsetCoordinates(state);

        public static OffsetCoordinates FromProperties(int col, int row) => new OffsetCoordinates(
            col: col,
            row: row
        );

        public static OffsetCoordinates FromAxial(IAxialCoordinates state) 
        {
            // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
            var col = state.X + (state.Z - (state.Z & 1)) / 2;
            var row = state.Z;
            return new OffsetCoordinates(col: col, row: row);
        }
        
        public static OffsetCoordinates FromCubic(ICubicCoordinates state) =>
            OffsetCoordinates.FromAxial(state);
        
        public static OffsetCoordinates FromOrderedPair(int[] orderedPair) {
            if (orderedPair.Length < 2)
                throw new Exception("Length of ordered pair must be 2 (or greater)");
                var col = orderedPair[0]; // x
                var row = orderedPair[1]; // z
            return new OffsetCoordinates(col: col, row: row);
        }

        public AxialCoordinates ToAxial() =>
            AxialCoordinates.FromOffset(this);

        public CubicCoordinates ToCubic() => CubicCoordinates.FromOffset(this);

        public int[] ToOrderedPair() => new int[] { Col, Row };

    }
}