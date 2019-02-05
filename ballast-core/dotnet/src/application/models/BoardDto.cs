using System;

namespace Ballast.Core.Application.Models
{
    public class BoardDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public bool CenterOrigin { get; set; }
        public TileDto[] Tiles { get; set; }
        public string TileShape { get; set; }
        public bool ApplyHexRowScaling { get; set; }
        public bool DoubleIncrement { get; set; }
        public bool HasDirectionNorth { get; set; }
        public bool HasDirectionSouth { get; set; }
        public bool HasDirectionWest { get; set; }
        public bool HasDirectionEast { get; set; }
        public bool HasDirectionNorthWest { get; set; }
        public bool HasDirectionSouthWest { get; set; }
        public bool HasDirectionSouthEast { get; set; }
    }
}