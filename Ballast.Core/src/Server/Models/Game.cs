using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Game : IGame
    {

        private readonly Board _board;
        private readonly IEnumerable<Vessel> _vessels;

        public Guid Id { get; private set; }
        public IBoard Board => _board;
        public IEnumerable<IVessel> Vessels => _vessels;

        private Game(Guid id, IBoard board, IEnumerable<IVessel> vessels)
        {
            _board = Models.Board.FromObject(board);
            _vessels = vessels.Select(x => Vessel.FromObject(x));
            Id = id;
        }
        
        private Game(IGame state): this(
            id: state.Id, 
            board: state.Board, 
            vessels: state.Vessels
        ) { }

        public static Game FromObject(IGame state) => new Game(state);

        public static Game FromProperties(Guid id, IBoard board, IEnumerable<IVessel> vessels) => new Game(
            id: id,
            board: board,
            vessels: vessels
        );
        
    }
}