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
        public DateTime CreatedUtc { get; private set; }
        public DateTime? StartedUtc { get; private set; }
        public DateTime? EndedUtc { get; private set; }

        private Game(
            Guid id, 
            IBoard board, 
            IEnumerable<IVessel> vessels, 
            IEnumerable<IPlayer> players,
            DateTime? createdUtc = null,
            DateTime? startedUtc = null,
            DateTime? endedUtc = null
        )
        {
            _board = Models.Board.FromObject(board);
            _vessels = vessels.Select(x => Vessel.FromObject(x));
            _players = players.Select(x => Player.FromObject(x));
            Id = id;
            CreatedUtc = createdUtc ?? DateTime.UtcNow;
            StartedUtc = startedUtc;
            EndedUtc = endedUtc;
        }
        
        private Game(IGame state): this(
            id: state.Id, 
            board: state.Board, 
            vessels: state.Vessels, 
            players: state.Players,
            createdUtc: state.CreatedUtc,
            startedUtc: state.StartedUtc,
            endedUtc: state.EndedUtc
        ) { }

        public static Game FromObject(IGame state) => new Game(state);

        public static Game FromProperties(
            Guid id, 
            IBoard board,
            IEnumerable<IVessel> vessels, 
            IEnumerable<IPlayer> players,
            DateTime? createdUtc = null,
            DateTime? startedUtc = null,
            DateTime? endedUtc = null
        ) => new Game(
            id: id,
            board: board,
            vessels: vessels,
            players: players,
            createdUtc: createdUtc,
            startedUtc: startedUtc,
            endedUtc: endedUtc
        );

        public ICubicCoordinates UpdateVesselCoordinates(Guid vesselId, ICubicCoordinates cubicCoordinates)
        {
            var foundVessel = this._vessels.SingleOrDefault(x => x.Id == vesselId);
            if (foundVessel == null)
                throw new KeyNotFoundException($"Could not locate vessel with id '{vesselId}'");
            return foundVessel.UpdateCoordinates(cubicCoordinates);
        }

        public DateTime Start()
        {
            if (StartedUtc != null)
                throw new InvalidOperationException("Can't re-start after it has already begun!");
            var startedUtc = DateTime.UtcNow;
            StartedUtc = startedUtc;
            return startedUtc;
        }

        public DateTime End()
        {
            if (EndedUtc != null)
                throw new InvalidOperationException("Can't end game after it has already finished!");
            var endedUtc = DateTime.UtcNow;
            EndedUtc = endedUtc;
            return endedUtc;
        }
        
    }
}