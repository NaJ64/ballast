using Ballast.Web.Hubs;
using System;
using System.Collections.Generic;

namespace Ballast.Web.Services
{
    public interface IPlayerConnectionRepository<TServiceHub> where TServiceHub : ServiceHubBase
    {
        Guid? GetPlayerId(string connectionId);
        Guid? SetPlayerId(string connectionId, Guid? playerId);
        IEnumerable<string> GetAll();
        IEnumerable<string> GetAll(Guid playerId);
        void Add(string connectionId, Guid? playerId = null);
        void Remove(string connectionId);
    }
}

