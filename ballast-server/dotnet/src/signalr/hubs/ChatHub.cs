using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;
using Ballast.Server.SignalR.HubMethods;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.Hubs 
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

        
    }
}