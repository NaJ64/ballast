using System;
using System.Threading.Tasks;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.HubMethods
{
    public abstract class ServiceHubMethodsBase<TServiceHub> where TServiceHub : ServiceHubBase
    {

        protected readonly IHubContext<TServiceHub> _hubContext;
        protected readonly IPlayerConnectionRepository<TServiceHub> _playerConnections;

        public ServiceHubMethodsBase(IHubContext<TServiceHub> hubContext, IPlayerConnectionRepository<TServiceHub> playerConnections)
        {
            _hubContext = hubContext;
            _playerConnections = playerConnections;
        }

    }
}