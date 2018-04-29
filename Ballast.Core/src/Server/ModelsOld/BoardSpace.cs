// using System.Collections.Generic;

// namespace Ballast.Core.Models
// {
//     public class BoardSpace
//     {
        
//         public (int Row, int Column) Coordinates { get; private set; }
//         public Terrain Terrain { get; set; }
//         public BoardSpace NorthAdjacent { get; set; }
//         public BoardSpace SouthAdjacent { get; set; }
//         public BoardSpace EastAdjacent { get; set; }
//         public BoardSpace WestAdjacent { get; set; }
//         public BoardSpace NorthWestAdjacent { get; set; }
//         public BoardSpace NorthEastAdjacent { get; set; }
//         public BoardSpace SouthWestAdjacent { get; set; }
//         public BoardSpace SouthEastAdjacent { get; set; }

//         public BoardSpace((int Row, int Column) coordinates, Terrain terrain)
//         {
//             Coordinates = coordinates;
//             Terrain = terrain;
//         }

//         public void SetAdjacents(IEnumerable<BoardSpace> boardSpaces)
//         {
//             // TODO:  Implement this lookup whereby the current space calculates adjacent spaces using the entire board
//         }

//     }
// }
