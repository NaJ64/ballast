using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.HubMethods
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