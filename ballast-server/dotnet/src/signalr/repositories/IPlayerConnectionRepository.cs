using System;
using System.Collections.Generic;
using Ballast.Server.SignalR.Hubs;

namespace Ballast.Server.SignalR.Repositories
{

    public interface IPlayerConnectionRepository : IDisposable
    {
        Guid? GetPlayerId(string connectionId);
        Guid? SetPlayerId(string connectionId, Guid? playerId);
        IEnumerable<string> GetAll();
        IEnumerable<string> GetAll(Guid playerId);
        void Add(string connectionId, Guid? playerId = null);
        void Remove(string connectionId);
    }

    public interface IPlayerConnectionRepository<TServiceHub> : IPlayerConnectionRepository 
        where TServiceHub : ServiceHubBase { }

}