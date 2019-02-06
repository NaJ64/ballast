using Ballast.Core.Application.Events;
using Ballast.Core.Application.Services;
using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
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
            // Lookup all clients that are already in the game and notify them
            var connectionIds = _playerConnections.GetAll();
            foreach(var connectionId in connectionIds)
            {
                var playerId = _playerConnections.GetPlayerId(connectionId);
                var client = _hubContext.Clients.Client(connectionId);
                await client?.SendAsync("ChatMessageSent", evt);
            }
        }

    }
}