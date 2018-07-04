using Ballast.Core.Messaging.Events;
using Ballast.Core.Services;
using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Ballast.Web.HubMethods
{
    public class ChatHubMethods : ServiceHubMethodsBase<ChatHub>
    {

        private readonly IChatService _chatService;

        public ChatHubMethods(
            IHubContext<ChatHub> hubContext, 
            IPlayerConnectionRepository<ChatHub> playerConnections, 
            IChatService chatService
        ) : base(hubContext, playerConnections) 
        { 
            _chatService = chatService;
        }

        public async Task OnChatMessageSentAsync(ChatMessageSentEvent evt)
        {
            await Task.CompletedTask;
            // // Lookup all clients that are already in the game and notify them
            // var connectionIds = await GetPlayerConnectionsForGameAsync(evt.Game);
            // foreach(var connectionId in connectionIds)
            // {
            //     var client = _hubContext.Clients.Client(connectionId);
            //     await client?.SendAsync("PlayerLeftGame", evt);
            // }
        }

    }
}