using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Board
    {
        
        public BoardType Type { get; private set; }
        public IEnumerable<BoardSpace> Spaces { get; private set; }
        public IDictionary<int, IList<BoardSpace>> Rows { get; private set; }
        public IDictionary<int, IList<BoardSpace>> Columns { get; private set; }
        public IEnumerable<Vessel> Vessels { get; private set; }

        public Board(BoardType type, (int Rows, int Columns) dimensions, bool? autoTerrain = false) 
        {
            var spaces = GenerateSpaces(dimensions.Rows, dimensions.Columns);
            Spaces = spaces.All;
            Rows = spaces.Rows;
            Columns = spaces.Columns;
        }

        private (IEnumerable<BoardSpace> All, IDictionary<int, IList<BoardSpace>> Rows, IDictionary<int, IList<BoardSpace>> Columns) GenerateSpaces(int rowCount, int columnCount)
        {
            var defaultTerrain = Terrain.Water;
            var allSpaces = new List<BoardSpace>();
            var rowSpaces = new Dictionary<int, IList<BoardSpace>>();
            var colSpaces = new Dictionary<int, IList<BoardSpace>>();
            for(var col = 0; col < columnCount; col++)
            {
                colSpaces[col] = new List<BoardSpace>();
            } 
            for(var row = 0; row < rowCount; row++)
            {
                rowSpaces[row] = new List<BoardSpace>();
                for(var col = 0; col < columnCount; col++)
                {
                    var space = new BoardSpace((row, col), defaultTerrain);  
                    rowSpaces[row].Add(space);
                    colSpaces[col].Add(space);
                    allSpaces.Add(space);
                }  
            }
            foreach(var space in allSpaces)
            {
                space.SetAdjacents(allSpaces);
            }
            return (allSpaces, rowSpaces, colSpaces);
        }

        private void SetTerrain(Terrain terrain, int row, int column)
        {
            
        }

    }
}
