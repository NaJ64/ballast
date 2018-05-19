using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class Game : IGame
    {

        private readonly Board _board;
        private IList<Vessel> _vessels;
        private IList<Player> _players;

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
            _vessels = vessels.Select(x => Vessel.FromObject(x)).ToList();
            _players = players.Select(x => Player.FromObject(x)).ToList();
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
                throw new InvalidOperationException("Can't re-start game after it has already begun!");
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

        public Player AddPlayer(Player player) 
        {
            if (player == null || player.Id == default(Guid))
                throw new ArgumentNullException(nameof(player.Id));
            if (_players.Any(x => x.Id == player.Id))
                throw new ArgumentException($"Player with id {player?.Id} already exists");
            _players.Add(player);
            return player;
        }

        public void SetVesselRole(Guid vesselId, VesselRole vesselRole, Player player)
        {
            var vessel = _vessels.FirstOrDefault(x => x.Id == vesselId);
            if (vessel == null)
                throw new KeyNotFoundException($"Could not find vessel for id {vesselId}");
            vessel.SetVesselRole(vesselRole, player);
        }

        public void RemovePlayerById(Guid playerId) 
        {
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(playerId));
            var player = _players.FirstOrDefault(x => x.Id == playerId);
            RemovePlayer(player);
        }

        public void RemovePlayer(Player player) 
        {
            if (player == null || player.Id == default(Guid))
                throw new ArgumentNullException(nameof(player.Id));
            foreach(var vessel in _vessels)
            {
               vessel.RemovePlayer(player); 
            }
            if (_players.Any(x => x.Id == player.Id))
                _players.Remove(player);
        }
        
    }
}