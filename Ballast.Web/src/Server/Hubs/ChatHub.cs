using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs 
{
    public class ChatHub : ServiceHubBase
    {

        private readonly Func<IChatService> _chatServiceFactory;

        public ChatHub(IEventBus eventBus, Func<IChatService> chatServiceFactory) : base(eventBus)
        {
            _chatServiceFactory = chatServiceFactory;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public Task SendMessage(Guid invocationId, ChatMessage message)
        {
            return Clients.All.SendAsync("messageReceived", message);    
        }
        
    }
}