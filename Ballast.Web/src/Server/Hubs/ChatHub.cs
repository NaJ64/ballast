using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class ChatHub : Hub
    {
        public Task SendMessageAsync(Guid invocationId, ChatMessage message)
        {
            return Clients.All.SendAsync("messageReceived", message);    
        }
    }
}