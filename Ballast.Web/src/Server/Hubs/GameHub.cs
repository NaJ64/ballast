using Ballast.Core.Models;
using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs
{
    public class GameHub : ServiceHubBase
    {

        private readonly IGameService _gameService;
        private readonly IGame _defaultGame;

        public GameHub(IEventBus eventBus, Func<IGameService> gameServiceFactory) : base(eventBus)
        {
            _gameService = gameServiceFactory();
            var gameOptions = new CreateGameOptions() 
            {
                VesselOptions = new CreateVesselOptions[0]
            };
            _defaultGame = _gameService // Create a default (global) game
                .CreateGameAsync(gameOptions)
                .GetAwaiter()
                .GetResult();
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public Task MoveVessel(VesselMoveRequest vesselMoveRequest)
        {
            var gameId = Guid.NewGuid();
            var boardGenerator = new BoardGenerator();
            var board = boardGenerator.CreateBoard(gameId, BoardType.RegularPolygon, TileShape.Circle, 7);
            var game = Game.FromProperties(
                id: gameId,
                board: board,
                vessels: new List<Vessel>(),
                players: new List<Player>()
            );
            return Clients.All.SendAsync("gameStateChanged", game);
        }

        public async Task CreateNewGame(Guid invocationId, CreateVesselOptions[] vesselOptions, int? boardSize = null, int? boardShape = null)
        {
            try
            {
                var useBoardShape = boardShape != null ? TileShape.FromValue((int)boardShape) : null;
                var createGameOptions = new CreateGameOptions()
                {
                    VesselOptions = vesselOptions,
                    BoardSize = boardSize,
                    BoardShapeValue = useBoardShape?.Value
                };
                var value = await _gameService.CreateGameAsync(createGameOptions);
                await ResolveValueAsync(Clients.Caller, nameof(CreateNewGame), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(CreateNewGame), invocationId, ex.Message);
            }
        }

        public async Task GetAllGames(Guid invocationId)
        {
            try
            {
                var value = await _gameService.GetAllGamesAsync();
                await ResolveValueAsync(Clients.Caller, nameof(CreateNewGame), invocationId, value);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(GetAllGames), invocationId, ex.Message);
            }
        }

    }
}