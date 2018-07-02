using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;

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

    }
}