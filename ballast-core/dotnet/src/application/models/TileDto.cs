using System;

namespace Ballast.Core.Application.Models
{
    public class TileDto
    {
        public int[] OrderedTriple { get; set; }
        public string TileShape { get; set; }
        public string Terrain { get; set; }
        public bool Passable { get; set; }
    }
}