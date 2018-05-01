// using System;
// using System.Collections.Generic;
// using System.Linq;

// namespace Ballast.Core.Models
// {
//     public class Terrain
//     {
//         public static Terrain Water => new Terrain(0, "Water", true);
//         public static Terrain DeepWater => new Terrain(1, "DeepWater", true);
//         public static Terrain ShallowWater => new Terrain(2, "ShallowWater", true);
//         public static Terrain Coast => new Terrain(3, "Coast", false);
//         public static Terrain Grass => new Terrain(4, "Grass", false);
//         public static Terrain Forest => new Terrain(5, "Forest", false);
//         public static Terrain Mountain => new Terrain(6, "Mountain", false);

//         public int Value { get; private set; }
//         public string Name { get; private set; }
//         public bool Passable { get; private set; }

//         private Terrain(int value, string name, bool passable)
//         {
//             Value = value;
//             Name = name;
//             Passable = passable;
//         }

//         public static IEnumerable<Terrain> List()
//         {
//             // alternately, use a dictionary keyed by value
//             return new[] {
//                 Water, 
//                 DeepWater, 
//                 ShallowWater, 
//                 Coast, 
//                 Grass, 
//                 Forest, 
//                 Mountain
//             };
//         }

//         public static Terrain FromString(string value)
//         {
//             return List().Single(x => String.Equals(x.Name, value, StringComparison.OrdinalIgnoreCase));
//         }

//         public static Terrain FromValue(int value)
//         {
//             return List().Single(x => x.Value == value);
//         }
//     }
// }
