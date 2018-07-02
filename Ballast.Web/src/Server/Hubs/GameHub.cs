using Ballast.Core.Models;
using Ballast.Core.Messaging;
using Ballast.Core.Messaging.Events.Game;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Ballast.Web.HubMethods;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs
{
    public class GameHub : ServiceHubBase
    {

        private readonly GameHubMethods _hubMethods;
        private readonly IGameService _gameService;

        public GameHub(
            IPlayerConnectionRepository<GameHub> playerConnections, 
            GameHubMethods hubMethods, 
            IGameService gameService
        ) : base(playerConnections)
        {
            _hubMethods = hubMethods;
            _gameService = gameService;
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

        public async Task GetTestGameIdAsync(Guid invocationId) 
        {
            try
            {
                var value = await _gameService.GetTestGameIdAsync();
                await ResolveValueAsync(Clients.Caller, nameof(GetTestGameIdAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(GetTestGameIdAsync), invocationId, ex.Message);
            }
        }

        public async Task GetAllGamesAsync(Guid invocationId)
        {
            try
            {
                var value = await _gameService.GetAllGamesAsync();
                await ResolveValueAsync(Clients.Caller, nameof(GetAllGamesAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(GetAllGamesAsync), invocationId, ex.Message);
            }
        }

        public async Task GetGameAsync(Guid invocationId, Guid gameId)
        {
            try
            {
                var value = await _gameService.GetGameAsync(gameId);
                await ResolveValueAsync(Clients.Caller, nameof(GetGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(GetGameAsync), invocationId, ex.Message);
            }
        }

        public async Task CreateGameAsync(Guid invocationId, CreateGameOptions options)
        {
            try
            {
                var value = await _gameService.CreateGameAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(CreateGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(CreateGameAsync), invocationId, ex.Message);
            }
        }
        
        public async Task StartGameAsync(Guid invocationId, Guid gameId)
        {
            try
            {
                var value = await _gameService.StartGameAsync(gameId);
                await ResolveValueAsync(Clients.Caller, nameof(StartGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(StartGameAsync), invocationId, ex.Message);
            }
        }

        public async Task EndGameAsync(Guid invocationId, Guid gameId)
        {
            try
            {
                var value = await _gameService.EndGameAsync(gameId);
                await ResolveValueAsync(Clients.Caller, nameof(EndGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(EndGameAsync), invocationId, ex.Message);
            }
        }

        public async Task DeleteGameAsync(Guid invocationId, Guid gameId)
        {
            try
            {
                await _gameService.DeleteGameAsync(gameId);
                await ResolveAsync(Clients.Caller, nameof(DeleteGameAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(DeleteGameAsync), invocationId, ex.Message);
            }
        }

        public async Task AddPlayerToGameAsync(Guid invocationId, AddPlayerOptions options)
        {
            try
            {
                var value = await _gameService.AddPlayerToGameAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(AddPlayerToGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(AddPlayerToGameAsync), invocationId, ex.Message);
            }
        }

        public async Task RemovePlayerFromGameAsync(Guid invocationId, RemovePlayerOptions options)
        {
            try
            {
                var value = await _gameService.RemovePlayerFromGameAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(RemovePlayerFromGameAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(RemovePlayerFromGameAsync), invocationId, ex.Message);
            }
        }
        
        public async Task AddPlayerToVesselAsync(Guid invocationId, AddPlayerOptions options)
        {
            try
            {
                var value = await _gameService.AddPlayerToVesselAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(AddPlayerToVesselAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(AddPlayerToVesselAsync), invocationId, ex.Message);
            }
        }
        
        public async Task RemovePlayerFromVesselAsync(Guid invocationId, RemovePlayerOptions options)
        {
            try
            {
                var value = await _gameService.RemovePlayerFromVesselAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(RemovePlayerFromVesselAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(RemovePlayerFromVesselAsync), invocationId, ex.Message);
            }
        }
        
        public async Task AddPlayerToVesselRoleAsync(Guid invocationId, AddPlayerOptions options)
        {
            try
            {
                var value = await _gameService.AddPlayerToVesselRoleAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(AddPlayerToVesselRoleAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(AddPlayerToVesselRoleAsync), invocationId, ex.Message);
            }
        }
        
        public async Task RemovePlayerFromVesselRoleAsync(Guid invocationId, RemovePlayerOptions options)
        {
            try
            {
                var value = await _gameService.RemovePlayerFromVesselRoleAsync(options);
                await ResolveValueAsync(Clients.Caller, nameof(RemovePlayerFromVesselRoleAsync), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(RemovePlayerFromVesselRoleAsync), invocationId, ex.Message);
            }
        }
        
        public async Task MoveVesselAsync(Guid invocationId, VesselMoveRequest request)
        {
            try
            {
                await _gameService.MoveVesselAsync(request);
                await ResolveAsync(Clients.Caller, nameof(MoveVesselAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(MoveVesselAsync), invocationId, ex.Message);
            }
        }
        
    }
}