using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class TileShape : StaticListTypeBase, ITileShape
    {

        public static TileShape Square = new TileShape(
            value: 0,
            name: "Square",
            doubleIncrement: true,
            hasDirectionNorth: true,
            hasDirectionSouth: true,
            hasDirectionWest: true,
            hasDirectionEast: true
        );

        public static TileShape Octagon = new TileShape(
            value: 1,
            name: "Octagon",
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

        public static TileShape Hexagon = new TileShape(
            value: 2,
            name: "Hexagon",
            applyHexRowScaling: true,
            hasDirectionWest: true,
            hasDirectionEast: true,
            hasDirectionNorthWest: true,
            hasDirectionNorthEast: true,
            hasDirectionSouthWest: true,
            hasDirectionSouthEast: true
        );

        public static TileShape Circle = new TileShape(
            value: 3,
            name: "Circle",
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

    }
}