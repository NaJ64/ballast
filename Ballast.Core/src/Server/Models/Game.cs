using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Game : IGame
    {
        public Guid Id { get; private set; }
        public IBoard Board { get; private set; }
        public IEnumerable<IVessel> Vessels { get; private set; }
        public Game(IGame state): this(
            id: state.Id, 
            board: state.Board, 
            vessels: state.Vessels
            ){ }
        public Game(Guid id, IBoard board, IEnumerable<IVessel> vessels)
        {
            Id = id;
            Board = board;
            Vessels = vessels;
        }
    }
}