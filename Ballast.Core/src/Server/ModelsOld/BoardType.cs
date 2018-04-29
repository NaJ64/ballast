// using System;
// using System.Collections.Generic;
// using System.Linq;

// namespace Ballast.Core.Models
// {
//     public class BoardType
//     {
//         public static BoardType Square => new BoardType(0, "Square");
//         public static BoardType Octagon => new BoardType(1, "Octagon");

//         public int Value { get; private set; }
//         public string Name { get; private set; }

//         private BoardType(int value, string name)
//         {
//             Value = value;
//             Name = name;
//         }

//         public static IEnumerable<BoardType> List()
//         {
//             // alternately, use a dictionary keyed by value
//             return new[] {
//                 Square,
//                 Octagon
//             };
//         }

//         public static BoardType FromString(string text)
//         {
//             return List().Single(x => String.Equals(x.Name, text, StringComparison.OrdinalIgnoreCase));
//         }

//         public static BoardType FromValue(int value)
//         {
//             return List().Single(x => x.Value == value);
//         }
//     }
// }
