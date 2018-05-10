using Ballast.Core.Messaging;
using Ballast.Core.Models;
using Ballast.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class GameService : IGameService
    {

        private static int DEFAULT_BOARD_SIZE = 5;
        private static IBoardType DEFAULT_BOARD_TYPE = BoardType.RegularPolygon;
        private static ITileShape DEFAULT_TILE_SHAPE = TileShape.Hexagon;

        private readonly IEventBus _eventBus;
        private readonly IBoardGenerator _boardGenerator;
        private readonly IDictionary<Guid, Game> _games;

        public GameService(IEventBus eventBus, IBoardGenerator boardGenerator)
        {
            _eventBus = eventBus;
            _boardGenerator = boardGenerator;
            _games = new Dictionary<Guid, Game>();
        }

        public void Dispose() 
        { 
            _games.Clear();
        }

        public async Task<IEnumerable<IGame>> GetAllGamesAsync() => await Task.FromResult(_games.Values);

        public async Task<IGame> GetGameAsync(Guid gameId)
        {
            if (_games.ContainsKey(gameId))
                return await Task.FromResult(_games[gameId]);
            return null;
        }

        public async Task<IGame> CreateGameAsync(CreateGameOptions options)
        {
            var gameId = Guid.NewGuid();
            var useBoardSize = options.BoardSize ?? DEFAULT_BOARD_SIZE;
            if (useBoardSize % 2 == 0)
                useBoardSize++;
            var useBoardType = DEFAULT_BOARD_TYPE;
            var useTileShape = (options.BoardShapeValue != null) 
                ? Models.TileShape.FromValue((int)options.BoardShapeValue)
                : DEFAULT_TILE_SHAPE;

            var board = _boardGenerator.CreateBoard(
                id: Guid.NewGuid(), 
                boardType: useBoardType, // Default
                tileShape: useTileShape,
                columnsOrSideLength: useBoardSize
                );

            var player1Id = Guid.NewGuid();
            var player1Name = "Test Player 1";
            var players = new List<Player>()
            {
                Player.FromProperties(
                    id: player1Id,
                    name: player1Name
                )
            };
            var vessels = CreateVessels(options.VesselOptions, board, players[0], players[0]);
            var game = Game.FromProperties(id: gameId, board: board, vessels: vessels, players: players); 
            _games[gameId] = game;
            return await Task.FromResult(game);
        }

        public Task<IGame> StartGameAsync(Guid gameId) => throw new NotImplementedException();

        public Task<IGame> EndGameAsync(Guid gameId) => throw new NotImplementedException();

        public Task DeleteGameAsync(Guid gameId)
        {
            if (_games.ContainsKey(gameId))
                _games.Remove(gameId);
            return Task.CompletedTask;
        }

        private IEnumerable<Vessel> CreateVessels(IEnumerable<CreateVesselOptions> createVesselOptions, Board board, Player captain, Player radioman)
        {
            var vessels = new List<Vessel>();
            foreach(var vesselOptions in createVesselOptions) 
            {
                var vesselId = Guid.NewGuid();
                var startingCoordinates = vesselOptions.StartOrderedTriple != null
                    ? CubicCoordinates.FromOrderedTriple(vesselOptions.StartOrderedTriple)
                    : board.GetRandomPassableCoordinates();
                var vessel = Vessel.FromProperties(
                    id: vesselId,
                    cubicCoordinates: startingCoordinates,
                    captain: captain,
                    radioman: radioman
                );
                vessels.Add(vessel);
            }
            return vessels;
        }

        public Task<IGame> AddPlayerToGameAsync(AddPlayerOptions options) => throw new NotImplementedException();

        public Task<IGame> RemovePlayerFromGameAsync(RemovePlayerOptions options) => throw new NotImplementedException();

        public Task<IVessel> AddPlayerToVesselAsync(AddPlayerOptions options) => throw new NotImplementedException();

        public Task<IVessel> RemovePlayerFromVesselAsync(RemovePlayerOptions options) => throw new NotImplementedException();

        public Task<IVessel> AddPlayerToVesselRoleAsync(AddPlayerOptions options) => throw new NotImplementedException();

        public Task<IVessel> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options) => throw new NotImplementedException();


        public Task MoveVesselAsync(VesselMoveRequest request) => throw new NotImplementedException();
        
    }
}