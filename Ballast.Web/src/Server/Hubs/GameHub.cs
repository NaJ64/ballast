using Ballast.Core.Models;
using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs
{
    public class GameHub : ServiceHubBase
    {

        private readonly Func<IGameService> _gameServiceFactory;

        public GameHub(IEventBus eventBus, Func<IGameService> gameServiceFactory) : base(eventBus)
        {
            _gameServiceFactory = gameServiceFactory;
        }

        public Task MoveVessel(VesselMoveRequest vesselMoveRequest)
        {
            var gameId = Guid.NewGuid();
            var boardGenerator = new BoardGenerator();
            var board = boardGenerator.CreateBoard(gameId, BoardType.RegularPolygon, TileShape.Circle, 7);
            var game = Game.FromProperties(
                id: gameId,
                board: board,
                vessels: new Vessel[] { }
            );
            return Clients.All.SendAsync("gameStateChanged", game);
        }

        public async Task CreateNewGame(Guid invocationId, CreateVesselOptions[] vesselOptions, int? boardSize = null, int? boardShape = null)
        {
            try
            {
                using (var gameService = _gameServiceFactory())
                {
                    var useBoardShape = boardShape != null ? TileShape.FromValue((int)boardShape) : null;
                    var value = await gameService.CreateNewGameAsync(vesselOptions, boardSize, useBoardShape);
                    await ResolveValueAsync(Clients.Caller, nameof(CreateNewGame), invocationId, value);
                }
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(CreateNewGame), invocationId, ex.Message);
            }
        }

    }
}