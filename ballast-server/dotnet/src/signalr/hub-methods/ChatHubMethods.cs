using System.Threading.Tasks;
using Ballast.Core.Application.Services;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.HubMethods
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