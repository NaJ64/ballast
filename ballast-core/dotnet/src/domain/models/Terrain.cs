using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Domain.Models
{
    public class Terrain : StaticListTypeBase<Terrain>
    {
    
        public readonly static Terrain Water = new Terrain(value: 0, name: nameof(Water), passable: true );
        public readonly static Terrain Coast = new Terrain(value: 1, name: nameof(Coast), passable: false );
        public readonly static Terrain Land = new Terrain(value: 2, name: nameof(Land), passable: false );
    
        public bool Passable { get; private set; }

        private Terrain(int value, string name, bool passable) : base(value, name) 
        {
            Passable = passable;
        }

        public static IEnumerable<Terrain> List() => new [] {
            Terrain.Water,
            Terrain.Coast,
            Terrain.Land
        };

        public static Terrain FromValue(int value) =>
            Terrain.List().Single(x => x.Value == value);

        public static Terrain FromName(string name) =>
            Terrain.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}