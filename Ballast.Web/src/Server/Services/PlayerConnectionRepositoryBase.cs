using Ballast.Web.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Web.Services
{
    public class PlayerConnectionRepository<TServiceHub> : IPlayerConnectionRepository<TServiceHub> 
        where TServiceHub : ServiceHubBase
    {

        private readonly IDictionary<string, Guid?> _playerConnections;

        public PlayerConnectionRepository() 
        {
            _playerConnections = new Dictionary<string, Guid?>();
        }

        public Guid? GetPlayerId(string connectionId)
        {
            AddConnectionIfMissing(connectionId);
            return _playerConnections[connectionId];

        }        
        public Guid? SetPlayerId(string connectionId, Guid? playerId) 
        {
            AddConnectionIfMissing(connectionId);
            if (playerId.GetValueOrDefault().Equals(Guid.Empty))
                _playerConnections[connectionId] = null;
            else
                _playerConnections[connectionId] = playerId;
            return _playerConnections[connectionId];
        }

        public IEnumerable<string> GetAll() => _playerConnections
            .Select(x => x.Key);

        public IEnumerable<string> GetAll(Guid playerId) => _playerConnections
            .Where(x => x.Value?.Equals(playerId) ?? false)
            .Select(x => x.Key);

        public void Add(string connectionId, Guid? playerId = null) => SetPlayerId(connectionId, playerId);

        public void Remove(string connectionId)
        {
            if (_playerConnections.ContainsKey(connectionId))
                _playerConnections.Remove(connectionId);
        }

        private void AddConnectionIfMissing(string connectionId)
        {
            if (!_playerConnections.ContainsKey(connectionId))
                _playerConnections.Add(connectionId, null);
        }

    }
}

