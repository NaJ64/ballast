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

        public Task MoveVesselAsync(VesselMoveRequest request) 
        {
            // Locate game matching id from request
            var gameId = request.GameId;
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(request.GameId));
            var game = _games.ContainsKey(gameId) ? _games[gameId] : null;
            if (game == null)
                throw new KeyNotFoundException($"Could not locate game with id '{gameId}'");

            // Make sure we have a valid board
            var board = game?.Board != null ? Board.FromObject(game.Board) : null;
            if (board == null)
                throw new KeyNotFoundException($"Game id '{gameId}' contains invalid board data!");

            // Locate vessel matching id from request
            var vesselId = request.VesselId;
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(request.VesselId));
            var foundVessel = game.Vessels.SingleOrDefault(x => x.Id == vesselId);
            if (foundVessel == null)
                throw new KeyNotFoundException($"Could not locate vessel with id '{vesselId}'");
            var vessel = Vessel.FromObject(foundVessel);

            // Derive current coordinates from request
            var requestStartCoordinates = CubicCoordinates.FromOrderedTriple(request.SourceOrderedTriple);
            var actualStartCoordinates = vessel.CubicCoordinates;

            // Make sure starting position matches current known position for vessel
            if (requestStartCoordinates.Equals(actualStartCoordinates))
                throw new InvalidOperationException("Requested vessel movement(s) must originate from current vessel position");
            var requestStartTile = Tile.FromObject(board.Tiles.SingleOrDefault(x => requestStartCoordinates.Equals(x)));

            // Determine if request specifies only cardinal directions or an actual set of tile coordinates
            ICubicCoordinates targetCoordinates = null;
            var doubleIncrement = game.Board.TileShape.DoubleIncrement ?? false;
            var useCardinalDirections = !request.TargetOrderedTriple.Any();
            if (!useCardinalDirections) 
            {
                // Get actual cubic coordinates
                var requestTargetCoordinates = CubicCoordinates.FromOrderedTriple(request.TargetOrderedTriple);
                // Verify that the target coordinates are one movement away from the current coordinates
                var totalUnitDistance = GetTotalUnitDistance(
                    doubleIncrement,
                    actualStartCoordinates,
                    requestTargetCoordinates
                );
                // Can't move multiple units and also must move at least 1 unit
                if (totalUnitDistance != 1)
                    throw new InvalidOperationException("Vessel movement must target a tile that is 1 unit away from current position");
                // Use target coordinates from request
                targetCoordinates = requestTargetCoordinates;
            }
            else 
            {
                // Get directions/movements
                var north = request.Direction?.North ?? false;
                var south = request.Direction?.South ?? false;
                var west = request.Direction?.West ?? false;
                var east = request.Direction?.East ?? false;
                // Determine movement based on cardinal direction(s)
                bool hasMovement = north || south || west || east;
                // If no movement (must move at least 1 unit), throw error
                if (!hasMovement)
                    throw new InvalidOperationException("Vessel movement must target a tile that is 1 unit away from current position");
                // Make sure we don't have any offsetting movements
                if ((north && south) | (west && east))
                    throw new InvalidOperationException("Vessel movement may not specify opposite cardinal directions at the same time");
                // Calculate combined (diagonal) directions
                var northWest = north && west;
                var southWest = south && west;
                var northEast = north && east;
                var southEast = south && east;
                // After assigning diagonals, reduce "due-____" directions
                north = north && (!northWest && !northEast);
                south = south && (!southWest && !southEast);
                west = west && (!northWest && !southWest);
                east = east && (!northEast && !southEast);
                // Make sure the movement direction(s) are allowed by the current board/tile shape
                if (north && (!board?.TileShape?.HasDirectionNorth ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit due North movement(s)");
                if (south && (!board?.TileShape?.HasDirectionSouth ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit due South movement(s)");
                if (west && (!board?.TileShape?.HasDirectionWest ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit due West movement(s)");
                if (east && (!board?.TileShape?.HasDirectionEast ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit due East movement(s)");
                if (northWest && (!board?.TileShape?.HasDirectionNorthWest ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit North-West movement(s)");
                if (southWest && (!board?.TileShape?.HasDirectionSouthWest ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit South-West movement(s)");
                if (northEast && (!board?.TileShape?.HasDirectionNorthEast ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit North-East movement(s)");
                if (southEast && (!board?.TileShape?.HasDirectionSouthEast ?? false))
                    throw new InvalidOperationException("Current board/tile shape does not permit South East movement(s)");
                // Get the adjacent tile
                Tile targetTile = null;
                if (north)
                    targetTile = GetNorthTile(board, requestStartCoordinates);
                else if (south)
                    targetTile = GetSouthTile(board, requestStartCoordinates);
                else if (west)
                    targetTile = GetWestTile(board, requestStartCoordinates);
                else if (east)
                    targetTile = GetEastTile(board, requestStartCoordinates);
                else if (northWest)
                    targetTile = GetNorthWestTile(board, requestStartCoordinates);
                else if (southWest)
                    targetTile = GetSouthWestTile(board, requestStartCoordinates);
                else if (northEast)
                    targetTile = GetNorthEastTile(board, requestStartCoordinates);
                else if (southEast)
                    targetTile = GetSouthEastTile(board, requestStartCoordinates);
                // Make sure we obtained a valid tile, otherwise keep the vessel where it already is 
                if (targetTile == null)
                    targetTile = requestStartTile;
                // Get new coordinates
                targetCoordinates = targetTile.CubicCoordinates;
            }

            // Move the vessel to the new coordinates
            game.UpdateVesselCoordinates(vesselId, targetCoordinates);

            // Finished
            return Task.CompletedTask;
        }

        private int GetTotalUnitDistance(bool doubleIncrement, ICubicCoordinates fromTileCoordinates, ICubicCoordinates toTileCoordinates)
        {
            var x1 = fromTileCoordinates.X;
            var y1 = fromTileCoordinates.Y;
            var z1 = fromTileCoordinates.Z;
            var x2 = toTileCoordinates.X;
            var y2 = toTileCoordinates.Y;
            var z2 = toTileCoordinates.Z;
            var distance = Math.Max(Math.Max(x2 - x1, y2 - y1), z2 - z1);
            if (doubleIncrement)
               return Convert.ToInt32(distance / 2);
            return distance;
        }

        private Tile GetNorthTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            if (!doubleIncrement)
                throw new Exception("Grid coordinate system does not support movement north without double-incrementation");
            var newCoordinates = fromTileCoordinates
                .AddXSubtractZ(1)
                .AddYSubtractZ(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetSouthTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            if (!doubleIncrement)
                throw new Exception("Grid coordinate system does not support movement south without double-incrementation");
            var newCoordinates = fromTileCoordinates
                .AddZSubtractX(1)
                .AddZSubtractY(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetWestTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddYSubtractX(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddXSubtractY(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetNorthWestTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddYSubtractZ(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetSouthWestTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddZSubtractX(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetNorthEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddXSubtractZ(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetSouthEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ?? false;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddZSubtractY(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

    }
}