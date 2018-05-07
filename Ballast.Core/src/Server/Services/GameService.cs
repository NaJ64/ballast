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

        public Task<IGame> CreateNewGameAsync(ICreateVesselOptions vesselOptions, int? boardSize = null, ITileShape boardShape = null) =>
            CreateNewGameAsync(new List<ICreateVesselOptions>() { vesselOptions }, boardSize, boardShape);
        
        public async Task<IGame> CreateNewGameAsync(IEnumerable<ICreateVesselOptions> vesselOptions, int? boardSize = null, ITileShape boardShape = null)
        {
            var gameId = Guid.NewGuid();
            var useBoardSize = boardSize ?? DEFAULT_BOARD_SIZE;
            if (useBoardSize % 2 == 0)
                useBoardSize++;
            var useBoardType = DEFAULT_BOARD_TYPE;
            var useTileShape = boardShape ?? DEFAULT_TILE_SHAPE;

            var board = _boardGenerator.CreateBoard(
                id: Guid.NewGuid(), 
                boardType: useBoardType, // Default
                tileShape: useTileShape,
                columnsOrSideLength: useBoardSize
                );

            var vessels = CreateVessels(vesselOptions, board);
            var game = Game.FromProperties(id: gameId, board: board, vessels: vessels); 
            _games[gameId] = game;
            return await Task.FromResult(game);
        }

        private IEnumerable<Vessel> CreateVessels(IEnumerable<ICreateVesselOptions> createVesselOptions, Board board)
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
                    cubicCoordinates: startingCoordinates
                );
                vessels.Add(vessel);
            }
            return vessels;
        }

        public Task MoveVesselAsync(IVesselMoveRequest request)
        {
            throw new NotImplementedException();
        }
        
    }
}