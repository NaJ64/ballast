using Ballast.Core.Chat;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class GameHub : Hub
    {
        public Task PublishGameState()
        {
            //return Clients.All.SendAsync("receiveMessage");    
        }
    }
}