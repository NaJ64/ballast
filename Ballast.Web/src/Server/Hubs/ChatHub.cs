using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class ChatHub : Hub
    {
        public Task SendMessage(ChatMessage message)
        {
            return Clients.All.SendAsync("receiveMessage", message);    
        }
    }
}