using Ballast.Core.Messaging.Events;
using Ballast.Core.Models;
using Ballast.Core.Services;
using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Web.HubMethods
{
    public class GameHubMethods : ServiceHubMethodsBase<GameHub>
    {

        private readonly IGameService _gameService;

        public GameHubMethods(
            IHubContext<GameHub> hubContext, 
            IPlayerConnectionRepository<GameHub> playerConnections, 
            IGameService gameService
        ) : base(hubContext, playerConnections)
        {
            _gameService = gameService;
        }

        public async Task<IEnumerable<string>> GetPlayerConnectionsForGameAsync(Game game) => 
            await GetPlayerConnectionsForGameAsync(game.Id);
            
        public async Task<IEnumerable<string>> GetPlayerConnectionsForGameAsync(Guid gameId)
        {
            var foundGame = await _gameService.GetGameAsync(gameId);
            var playerConnectionIdList = new List<string>();
            foreach(var player in foundGame.Players)
            {
                // This method returns a list of connections by client id
                // but since the game only allows one connection per id right now
                // it should be okay to just grab the first one
                var connectionId = _playerConnections.GetAll(player.Id).FirstOrDefault();
                if (connectionId != null)
                    playerConnectionIdList.Add(connectionId);
            }
            return playerConnectionIdList;
        }

        public async Task OnPlayerJoinedGameAsync(PlayerJoinedGameEvent evt)
        {
            // Lookup all clients that are already in the game and notify them
            var connectionIds = await GetPlayerConnectionsForGameAsync(evt.GameId);
            foreach(var connectionId in connectionIds)
            {
                var client = _hubContext.Clients.Client(connectionId);
                await client?.SendAsync("PlayerJoinedGame", evt);
            }
        }

        public async Task OnPlayerLeftGameAsync(PlayerLeftGameEvent evt)
        {
            // Lookup all clients that are already in the game and notify them
            var connectionIds = await GetPlayerConnectionsForGameAsync(evt.GameId);
            foreach(var connectionId in connectionIds)
            {
                var client = _hubContext.Clients.Client(connectionId);
                await client?.SendAsync("PlayerLeftGame", evt);
            }
        }

    }
}