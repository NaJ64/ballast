// using System;
// using System.Collections.Generic;
// using System.Linq;

// namespace Ballast.Core.Models
// {
//     public class Direction
//     {

//         public static Direction North => new Direction(0, "North", true);
//         public static Direction South => new Direction(1, "South", true);
//         public static Direction West => new Direction(2, "West", true);
//         public static Direction East => new Direction(3, "East", true);

//         public static Direction NorthWest => new Direction(4, "NorthWest", false);
//         public static Direction NorthEast => new Direction(5, "NorthEast", false);
//         public static Direction SouthWest => new Direction(6, "SouthWest", false);
//         public static Direction SouthEast => new Direction(7, "SouthEast", false);

//         public int Value { get; private set; }
//         public string Name { get; private set; }
//         public bool IsCardinal { get; private set; }

//         private Direction(int value, string name, bool isCardinal)
//         {
//             Value = value;
//             Name = name;
//             IsCardinal = isCardinal;
//         }

//         public static IEnumerable<Direction> List()
//         {
//             // alternately, use a dictionary keyed by value
//             return new[] {
//                 North, 
//                 South, 
//                 West, 
//                 East, 
//                 NorthWest, 
//                 NorthEast, 
//                 SouthWest, 
//                 SouthEast
//             };
//         }

//         public static Direction FromString(string text)
//         {
//             return List().Single(x => String.Equals(x.Name, text, StringComparison.OrdinalIgnoreCase));
//         }

//         public static Direction FromValue(int value)
//         {
//             return List().Single(x => x.Value == value);
//         }
//     }
// }
