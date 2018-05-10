using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class TileShape : StaticListTypeBase<TileShape>, ITileShape
    {

        public readonly static TileShape Square = new TileShape(
            value: 0,
            name: nameof(Square),
            doubleIncrement: true,
            hasDirectionNorth: true,
            hasDirectionSouth: true,
            hasDirectionWest: true,
            hasDirectionEast: true
        );

        public readonly static TileShape Octagon = new TileShape(
            value: 1,
            name: nameof(Octagon),
            doubleIncrement: true,
            hasDirectionNorth: true,
            hasDirectionSouth: true,
            hasDirectionWest: true,
            hasDirectionEast: true,
            hasDirectionNorthWest: true,
            hasDirectionNorthEast: true,
            hasDirectionSouthWest: true,
            hasDirectionSouthEast: true
        );

        public readonly static TileShape Hexagon = new TileShape(
            value: 2,
            name: nameof(Hexagon),
            applyHexRowScaling: true,
            hasDirectionWest: true,
            hasDirectionEast: true,
            hasDirectionNorthWest: true,
            hasDirectionNorthEast: true,
            hasDirectionSouthWest: true,
            hasDirectionSouthEast: true
        );

        public readonly static TileShape Circle = new TileShape(
            value: 3,
            name: nameof(Circle),
            applyHexRowScaling: true,
            hasDirectionWest: true,
            hasDirectionEast: true,
            hasDirectionNorthWest: true,
            hasDirectionNorthEast: true,
            hasDirectionSouthWest: true,
            hasDirectionSouthEast: true
        );

        public bool? ApplyHexRowScaling { get; private set; }
        public bool? DoubleIncrement { get; private set; }
        public bool? HasDirectionNorth { get; private set; }
        public bool? HasDirectionSouth { get; private set; }
        public bool? HasDirectionWest { get; private set; }
        public bool? HasDirectionEast { get; private set; }
        public bool? HasDirectionNorthWest { get; private set; }
        public bool? HasDirectionNorthEast { get; private set; }
        public bool? HasDirectionSouthWest { get; private set; }
        public bool? HasDirectionSouthEast { get; private set; }

        private TileShape(
            int value,
            string name,
            bool? applyHexRowScaling = null,
            bool? doubleIncrement = null,
            bool? hasDirectionNorth = null,
            bool? hasDirectionSouth = null,
            bool? hasDirectionWest = null,
            bool? hasDirectionEast = null,
            bool? hasDirectionNorthWest = null,
            bool? hasDirectionNorthEast = null,
            bool? hasDirectionSouthWest = null,
            bool? hasDirectionSouthEast = null
        ) : base(value, name)
        {
            ApplyHexRowScaling = applyHexRowScaling;
            DoubleIncrement = doubleIncrement;
            HasDirectionNorth = hasDirectionNorth;
            HasDirectionSouth = hasDirectionSouth;
            HasDirectionWest = hasDirectionWest;
            HasDirectionEast = hasDirectionEast;
            HasDirectionNorthWest = hasDirectionNorthWest;
            HasDirectionNorthEast = hasDirectionNorthEast;
            HasDirectionSouthWest = hasDirectionSouthWest;
            HasDirectionSouthEast = hasDirectionSouthEast;
        }

        private TileShape(ITileShape state) : this(
            value: state.Value, 
            name: state.Name, 
            applyHexRowScaling: state.ApplyHexRowScaling,
            doubleIncrement: state.DoubleIncrement,
            hasDirectionNorth: state.HasDirectionNorth,
            hasDirectionSouth: state.HasDirectionSouth,
            hasDirectionWest: state.HasDirectionWest,
            hasDirectionEast: state.HasDirectionEast,
            hasDirectionNorthWest: state.HasDirectionNorthWest,
            hasDirectionNorthEast: state.HasDirectionNorthEast,
            hasDirectionSouthWest: state.HasDirectionSouthWest,
            hasDirectionSouthEast: state.HasDirectionSouthEast
        ) { }

        public static IEnumerable<TileShape> List() => new [] {
            TileShape.Square,
            TileShape.Octagon,
            TileShape.Hexagon,
            TileShape.Circle
        };

        public static TileShape FromObject(ITileShape state) =>
            new TileShape(state);

        public static TileShape FromValue(int value) =>
            TileShape.List().Single(x => x.Value == value);

        public static TileShape FromString(string name) =>
            TileShape.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}