using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Game : IGame
    {

        private readonly Board _board;
        private readonly IEnumerable<Vessel> _vessels;
        private readonly IEnumerable<Player> _players;

        public Guid Id { get; private set; }
        public IBoard Board => _board;
        public IEnumerable<IVessel> Vessels => _vessels;
        public IEnumerable<IPlayer> Players => _players;

        private Game(Guid id, IBoard board, IEnumerable<IVessel> vessels, IEnumerable<IPlayer> players)
        {
            _board = Models.Board.FromObject(board);
            _vessels = vessels.Select(x => Vessel.FromObject(x));
            _players = players.Select(x => Player.FromObject(x));
            Id = id;
        }
        
        private Game(IGame state): this(
            id: state.Id, 
            board: state.Board, 
            vessels: state.Vessels, 
            players: state.Players
        ) { }

        public static Game FromObject(IGame state) => new Game(state);

        public static Game FromProperties(Guid id, IBoard board, IEnumerable<IVessel> vessels, IEnumerable<IPlayer> players) => new Game(
            id: id,
            board: board,
            vessels: vessels,
            players: players
        );
        
    }
}