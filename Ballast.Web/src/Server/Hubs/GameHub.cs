using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class GameHub : Hub
    {
        public Task RequestVesselMove(VesselMoveRequest vesselMoveRequest)
        {
            return Clients.All.SendAsync("requestVesselMove");
        }
    }
}