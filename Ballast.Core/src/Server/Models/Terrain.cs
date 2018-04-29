using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Terrain : StaticListTypeBase, ITerrain
    {
    
        public static Terrain Water = new Terrain(value: 0, name: "Water", passable: false );
        public static Terrain Coast = new Terrain(value: 1, name: "Coast", passable: true );
        public static Terrain Land = new Terrain(value: 2, name: "Land", passable: true );
    
        public bool Passable { get; private set; }

        private Terrain(int value, string name, bool passable) : base(value, name) 
        {
            Passable = passable;
        }

    }
}