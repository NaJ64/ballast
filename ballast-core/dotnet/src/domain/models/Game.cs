using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{

    public class GameState
    {
        public Guid Id { get; set; }
        public Board Board { get; set; }
        public IEnumerable<Vessel> Vessels { get; set; }
        public IEnumerable<Player> Players { get; set; }
        public DateTime CreatedUtc { get; set; }
        public DateTime? StartedUtc { get; set; }
        public DateTime? EndedUtc { get; set; }
    }

    public class Game
    {

        public Guid Id { get; private set; }
        public Board Board { get; private set; }
        public DateTime CreatedUtc { get; private set; }
        public DateTime? StartedUtc { get; private set; }
        public DateTime? EndedUtc { get; private set; }

        public IEnumerable<Vessel> Vessels => _vessels;
        private IList<Vessel> _vessels;

        public IEnumerable<Player> Players => _players;
        private IList<Player> _players;

        private Game(
            Guid id, 
            Board board, 
            IEnumerable<Vessel> vessels, 
            IEnumerable<Player> players,
            DateTime? createdUtc = null,
            DateTime? startedUtc = null,
            DateTime? endedUtc = null
        )
        {
            Id = id;
            Board = board;
            _vessels = vessels.ToList();
            _players = players.ToList();
            CreatedUtc = createdUtc ?? DateTime.UtcNow;
            StartedUtc = startedUtc;
            EndedUtc = endedUtc;
        }
        
        public static Game FromProperties(
            Guid id, 
            Board board,
            IEnumerable<Vessel> vessels, 
            IEnumerable<Player> players,
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

        public static implicit operator Game(GameState state) =>
            new Game(state.Id, state.Board, state.Vessels, state.Players, state.CreatedUtc, state.StartedUtc, state.EndedUtc);

        public CubicCoordinates UpdateVesselCoordinates(Guid vesselId, CubicCoordinates cubicCoordinates)
        {
            var foundVessel = this._vessels.SingleOrDefault(x => x.Id == vesselId);
            if (foundVessel == null)
                throw new KeyNotFoundException($"Could not locate vessel with id '{vesselId}'");
            var foundTile = this.Board.GetTileFromCoordinates(cubicCoordinates);
            if (foundTile == null) 
                throw new KeyNotFoundException($"Could not locate tile with coordinates '{cubicCoordinates.ToOrderedTriple()}'");
            if (!foundTile.Terrain.Passable)
                throw new InvalidOperationException($"The requested tile terrain is not passable");
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