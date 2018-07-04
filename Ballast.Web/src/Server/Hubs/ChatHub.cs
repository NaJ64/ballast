using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Ballast.Web.HubMethods;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs 
{
    public class ChatHub : ServiceHubBase
    {

        private readonly ChatHubMethods _hubMethods;
        private readonly IChatService _chatService;

        public ChatHub(
            IPlayerConnectionRepository<ChatHub> playerConnections, 
            ChatHubMethods hubMethods,
            IChatService chatService
        ) : base(playerConnections)
        {
            _hubMethods = hubMethods;
            _chatService = chatService;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _playerConnections.Add(Context.ConnectionId);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var playerId = _playerConnections.GetPlayerId(Context.ConnectionId).GetValueOrDefault();
            if (!playerId.Equals(Guid.Empty))
            {
                // TODO:  Remove the player from the current game
                // await _gameService.RemovePlayerFromGameAsync(new RemovePlayerOptions() {
                //     PlayerId = playerId.ToString(),
                //     GameId = <game-id-goes-here>
                // });
            }
            _playerConnections.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async override Task OnClientRegisteredAsync(string connectionId, Guid clientId)
        {
            _playerConnections.SetPlayerId(connectionId, clientId);
            await Task.CompletedTask;
        }

        public async Task SendMessageAsync(Guid invocationId, ChatMessage message)
        {
            try
            {
                await _chatService.SendMessageAsync(message);
                await ResolveAsync(Clients.Caller, nameof(SendMessageAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(SendMessageAsync), invocationId, ex.Message);
            }
        }

        public Task SendMessage(Guid invocationId, ChatMessage message)
        {
            return Clients.All.SendAsync("messageReceived", message);    
        }
        
    }
}