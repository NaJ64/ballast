using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class ChatHub : Hub
    {
        // Test method
        public Task SendMessageToAll(string message)
        {
            return Clients.All.SendAsync("ReceiveMessage", message);    
        }
    }
}