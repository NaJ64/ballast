using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Domain.Models
{
    public class Game
    {

        public Guid Id { get; private set; }
        public Board Board { get; private set; }
        public DateTime CreatedOnDate { get; private set; }
        public DateTime? StartedOnDate { get; private set; }
        public DateTime? EndedOnDate { get; private set; }

        public IEnumerable<Vessel> Vessels => _vessels;
        private IList<Vessel> _vessels;

        public IEnumerable<Player> Players => _players;
        private IList<Player> _players;

        public Game(
            Guid id, 
            Board board, 
            IEnumerable<Vessel> vessels, 
            IEnumerable<Player> players,
            DateTime? createdOnDate = null,
            DateTime? startedOnDate = null,
            DateTime? endedOnDate = null
        )
        {
            Id = id;
            Board = board;
            _vessels = vessels.ToList();
            _players = players.ToList();
            CreatedOnDate = createdOnDate ?? DateTime.UtcNow;
            StartedOnDate = startedOnDate;
            EndedOnDate = endedOnDate;
        }
        
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
            if (StartedOnDate != null)
                throw new InvalidOperationException("Can't re-start game after it has already begun!");
            var startedOnDate = DateTime.UtcNow;
            StartedOnDate = startedOnDate;
            return startedOnDate;
        }

        public DateTime End()
        {
            if (EndedOnDate != null)
                throw new InvalidOperationException("Can't end game after it has already finished!");
            var endedOnDate = DateTime.UtcNow;
            EndedOnDate = endedOnDate;
            return endedOnDate;
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