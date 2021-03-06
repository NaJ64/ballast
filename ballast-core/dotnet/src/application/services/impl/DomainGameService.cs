using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Models;
using Ballast.Core.Domain.Events;
using Ballast.Core.Domain.Models;
using Ballast.Core.Domain.Services;
using Ballast.Core.Messaging;
using Ballast.Core.Utilities;

namespace Ballast.Core.Application.Services.Impl
{
    public interface IDomainGameServiceOptions
    {
        string DefaultBoardType { get; set; }
        string DefaultTileShape { get; set; }
        int? DefaultBoardSize { get; set; }
        double? DefaultLandToWaterRatio { get; set; }
        IEnumerable<string> DefaultVessels { get; set; }
    }

    public class DomainGameService : IGameService
    {

        private static int DEFAULT_BOARD_SIZE = 7;
        private static double DEFAULT_LAND_TO_WATER_RATIO = 0.33;
        private static BoardType DEFAULT_BOARD_TYPE = BoardType.RegularPolygon;
        private static TileShape DEFAULT_TILE_SHAPE = TileShape.Hexagon;
        private static string[] DEFAULT_VESSEL_NAMES = new string[] { "U-571", "Red October", "The Nautilus" };

        private readonly IDomainGameServiceOptions _options;
        private readonly IEventBus _eventBus;
        private readonly IBoardGenerator _boardGenerator;
        private readonly IDictionary<Guid, Game> _games;
        private readonly Game _defaultGame;

        public DomainGameService(IDomainGameServiceOptions options, IEventBus eventBus, IBoardGenerator boardGenerator)
        {
            _options = options;
            _eventBus = eventBus;
            _boardGenerator = boardGenerator;
            _games = new Dictionary<Guid, Game>();
            
            if (_options?.DefaultBoardSize != null && _options.DefaultBoardSize.GetValueOrDefault() >= 3)
                DEFAULT_BOARD_SIZE = _options.DefaultBoardSize.GetValueOrDefault();
            if (_options?.DefaultBoardType != null)
                DEFAULT_BOARD_TYPE = BoardType.FromName(_options.DefaultBoardType);
            if (_options?.DefaultTileShape != null)
                DEFAULT_TILE_SHAPE = TileShape.FromName(_options.DefaultTileShape);
            if (_options?.DefaultLandToWaterRatio != null)
                DEFAULT_LAND_TO_WATER_RATIO = _options.DefaultLandToWaterRatio.GetValueOrDefault();
            if (_options?.DefaultVessels?.Any() ?? false)
                DEFAULT_VESSEL_NAMES = _options?.DefaultVessels.ToArray();
                
            _defaultGame = CreateDefaultGameAsync().GetAwaiter().GetResult();
            _eventBus.Subscribe<PlayerSignedOutDomainEvent>(nameof(PlayerSignedOutDomainEvent), OnPlayerSignedOutAsync);
        }

        public void Dispose()
        {
            _eventBus.Unsubscribe<PlayerSignedOutDomainEvent>(nameof(PlayerSignedOutDomainEvent), OnPlayerSignedOutAsync);
            _games.Clear();
        }

        public static GameDto MapToGameDto(Game game) => new GameDto()
        {
            Id = game.Id,
            Board = MapToBoardDto(game.Board),
            Vessels = game.Vessels.Select(x => MapToVesselDto(x)).ToArray(),
            Players = game.Players.Select(x => MapToPlayerDto(x)).ToArray(),
            CreatedOnDateIsoString = game.CreatedOnDate.ToIsoString(),
            StartedOnDateIsoString = game.StartedOnDate.ToIsoString(),
            EndedOnDateIsoString = game.EndedOnDate.ToIsoString(),
        };

        public static BoardDto MapToBoardDto(Board board) => new BoardDto()
        {
            Id = board.Id,
            TileShape = board.TileShape.Name,
            Type = board.BoardType.Name,
            Tiles = board.Tiles.Select(x => MapToTileDto(x)).ToArray(),
            CenterOrigin = board.BoardType.CenterOrigin,
            ApplyHexRowScaling = board.TileShape.ApplyHexRowScaling,
            DoubleIncrement = board.TileShape.DoubleIncrement,
            HasDirectionEast = board.TileShape.HasDirectionEast ?? false,
            HasDirectionNorth= board.TileShape.HasDirectionNorth ?? false,
            HasDirectionNorthWest = board.TileShape.HasDirectionNorthWest ?? false,
            HasDirectionSouth = board.TileShape.HasDirectionSouth ?? false,
            HasDirectionSouthEast = board.TileShape.HasDirectionSouthEast ?? false,
            HasDirectionSouthWest = board.TileShape.HasDirectionSouthWest ?? false,
            HasDirectionWest = board.TileShape.HasDirectionWest ?? false
        };

        public static TileDto MapToTileDto(Tile tile) => new TileDto() 
        {
            TileShape = tile.TileShape.Name,
            Terrain = tile.Terrain.Name,
            Passable = tile.Terrain.Passable,
            OrderedTriple = tile.CubicCoordinates.ToOrderedTriple()
        };

        public static VesselDto MapToVesselDto(Vessel vessel) => new VesselDto()
        {   
            Id = vessel.Id,
            Name = vessel.Name,
            OrderedTriple = vessel.CubicCoordinates.ToOrderedTriple(),
            CaptainId = vessel.Captain?.Id,
            CaptainName = vessel.Captain?.Name,
            RadiomanId = vessel.Radioman?.Id,
            RadiomanName = vessel.Radioman?.Name
        };

        public static PlayerDto MapToPlayerDto(Player player) => new PlayerDto()
        {
            Id = player.Id,
            Name = player.Name
        };

        private async Task<Game> CreateDefaultGameAsync()
        {
            var gameOptions = new CreateGameOptions()
            {
                BoardShape = DEFAULT_TILE_SHAPE.Name,
                BoardType = DEFAULT_BOARD_TYPE.Name,
                BoardSize = DEFAULT_BOARD_SIZE,
                LandToWaterRatio = DEFAULT_LAND_TO_WATER_RATIO,
                VesselOptions = DEFAULT_VESSEL_NAMES
                    .Select(x => new CreateVesselOptions() { RequestedName = x })
                    .ToArray()
            };
            var defaultGame = await CreateGameInternalAsync(gameOptions);
            return defaultGame;
        }

        private async Task<Game> CreateGameInternalAsync(CreateGameOptions options)
        {
            var gameId = Guid.NewGuid();
            var useBoardSize = options.BoardSize ?? DEFAULT_BOARD_SIZE;
            if (useBoardSize % 2 == 0)
                useBoardSize++;
            var useBoardType = (options.BoardType != null)
                ? BoardType.FromName(options.BoardType)
                : DEFAULT_BOARD_TYPE;
            var useTileShape = (options.BoardShape != null)
                ? TileShape.FromName(options.BoardShape)
                : DEFAULT_TILE_SHAPE;
            var useLandToWaterRatio = options.LandToWaterRatio;
            var board = _boardGenerator.CreateBoard(
                id: Guid.NewGuid(),
                boardType: useBoardType, // Default
                tileShape: useTileShape,
                columnsOrSideLength: useBoardSize,
                landToWaterRatio: useLandToWaterRatio
                );
            var players = new List<Player>();
            var vessels = CreateVessels(options.VesselOptions, board);
            var createdOnDate = DateTime.UtcNow;
            var game = new Game(id: gameId, board: board, vessels: vessels, players: players, createdOnDate: createdOnDate);
            _games[gameId] = game;
            await _eventBus.PublishAsync(GameStateChangedDomainEvent.FromGame(game));
            return game;
        }

        private async Task OnPlayerSignedOutAsync(PlayerSignedOutDomainEvent evt)
        {
            var playerId = evt.Player?.Id;
            if (!playerId.HasValue)
                return;
            var playerInGames = _games.Values.Where(x => x.Players.Any(y => y.Id.Equals(playerId)));
            foreach (var game in playerInGames)
            {
                var removePlayerOptions = new RemovePlayerOptions()
                {
                    PlayerId = playerId.Value,
                    GameId = game.Id
                };
                await RemovePlayerFromGameAsync(removePlayerOptions);
            }
        }

        private Task<Game> RetrieveGameByIdAsync(Guid gameId)
        {
            if (_games.ContainsKey(gameId))
                return Task.FromResult(_games[gameId]);
            throw new KeyNotFoundException($"No game found for id {gameId}");
        }

        private async Task RemoveGameByIdAsync(Guid gameId)
        {
            var game = await RetrieveGameByIdAsync(gameId);
            _games.Remove(gameId);
        }

        private IEnumerable<VesselRole> GetDefaultVesselRolesForPlayer(Vessel vessel, Player player)
        {
            // TODO: Update this method to only place player into a single role
            // Create role list
            var roles = new List<VesselRole>();
            // Return all the vessel roles that are empty
            if ((vessel.Captain?.Id ?? Guid.Empty) == default(Guid))
                roles.Add(VesselRole.Captain);
            if ((vessel.Radioman?.Id ?? Guid.Empty) == default(Guid))
                roles.Add(VesselRole.Radioman);
            // Return the role list
            return roles;
        }

        public Task<Guid> GetTestGameIdAsync() => 
            Task.FromResult(_defaultGame.Id);

        public Task<IEnumerable<GameDto>> GetAllGamesAsync() => 
            Task.FromResult(_games.Values.Select(game => MapToGameDto(game)));

        public async Task<GameDto> GetGameAsync(Guid gameId) => 
            MapToGameDto(await RetrieveGameByIdAsync(gameId));

        public async Task<GameDto> CreateGameAsync(CreateGameOptions options) =>
            MapToGameDto(await CreateGameInternalAsync(options));

        public async Task<GameDto> StartGameAsync(Guid gameId)
        {
            var game = await RetrieveGameByIdAsync(gameId);
            game.Start();
            return MapToGameDto(game);
        }

        public async Task<GameDto> EndGameAsync(Guid gameId)
        {
            var game = await RetrieveGameByIdAsync(gameId);
            game.End();
            return MapToGameDto(game);
        }

        public async Task DeleteGameAsync(Guid gameId) => 
            await RemoveGameByIdAsync(gameId);

        public async Task<GameDto> AddPlayerToGameAsync(AddPlayerOptions options)
        {
            // Make sure no arguments left blank
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            // Locate game matching id from request
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Make sure the player doesn't already exist (by matching id)
            var playerExists = game.Players.Any(x => x.Id == playerId);
            if (playerExists)
                throw new ArgumentException($"Player with id {playerId} already belongs to the requested game ({gameId})");
            // Create the player and add to the game
            var player = new Player(playerId, options.PlayerName); // TODO:  Determine how to default the name
            game.AddPlayer(player);
            // If a vessel id was provided, we want to add the player onto the specified vessel as well
            var playerAddedToVesselRoleEvents = new List<PlayerAddedToVesselRoleDomainEvent>();
            if (options.VesselId != null)
            {
                // Make sure the vessel exists
                var vesselId = options?.VesselId != null ? options.VesselId : default(Guid);
                var vessel = game.Vessels.FirstOrDefault(x => x.Id == vesselId);
                if (vessel == null)
                    throw new ArgumentException($"Vessel with id {options.VesselId} was not found in the requested game ({options.GameId})");
                // Build list of vessel roles to assign
                IEnumerable<VesselRole> vesselRoles = new List<VesselRole>();
                // If a vessel role list was provided, try to add the player into those roles (otherwise get default)
                if (options.VesselRoles.Any())
                    vesselRoles = options.VesselRoles.Select(x => VesselRole.FromName(x));
                else
                    vesselRoles = GetDefaultVesselRolesForPlayer(vessel, player);
                // Make sure we have at least one vessel role
                if (!vesselRoles.Any())
                    throw new ArgumentNullException(nameof(options.VesselRoles), "Can't add player to a vessel without specifying vessel role(s)");
                // Add into specified vessel role(s)
                foreach (var vesselRole in vesselRoles)
                {
                    // Set the role
                    game.SetVesselRole(vessel.Id, vesselRole, player);
                    // Store event to publish later
                    playerAddedToVesselRoleEvents.Add(
                        PlayerAddedToVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            vesselRole,
                            player
                        )
                    );
                }
            }
            // Raise event for player added into game
            await _eventBus.PublishAsync(PlayerJoinedGameDomainEvent.FromPlayerInGame(game, player));
            foreach (var playerAddedToVesselRoleEvent in playerAddedToVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerAddedToVesselRoleEvent);
            }
            // Return the updated game state
            return MapToGameDto(game);
        }

        public async Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options)
        {
            // Make sure required arguments were provided
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            // Get the game matching id from request 
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Get the player matching id from request 
            var player = game.Players.SingleOrDefault(x => x.Id.Equals(playerId));
            if (player == null)
                throw new ArgumentException($"Player with id {playerId} was not found in the requested game ({gameId})");
            // Make an event list for all of the vessel roles player is about to be removed from
            var playerRemovedFromVesselRoleEvents = new List<PlayerRemovedFromVesselRoleDomainEvent>();
            foreach (var vessel in game.Vessels)
            {
                // player is the Captain
                if ((vessel.Captain?.Id ?? Guid.Empty).Equals(playerId))
                {
                    playerRemovedFromVesselRoleEvents.Add(
                        PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Captain,
                            player
                        )
                    );
                }
                // Player is the Radioman
                if ((vessel.Radioman?.Id ?? Guid.Empty).Equals(playerId))
                {
                    playerRemovedFromVesselRoleEvents.Add(
                        PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Radioman,
                            player
                        )
                    );
                }
            }
            // Remove the player from the game
            game.RemovePlayer(player);
            // Raise event for player removed from vessel role
            foreach (var playerRemovedFromVesselRoleEvent in playerRemovedFromVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerRemovedFromVesselRoleEvent);
            }
            // Raise event for player left game
            await _eventBus.PublishAsync(PlayerLeftGameDomainEvent.FromPlayerInGame(game, player));
            // Return the updated game state
            return MapToGameDto(game);
        }

        public async Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options)
        {
            // Make sure no arguments left blank
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            var vesselId = options?.VesselId != null ? options.VesselId : default(Guid);
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(options.VesselId));
            // Locate game matching id from request
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Locate vessel matching id from request
            var vessel = game.Vessels.FirstOrDefault(x => x.Id.Equals(vesselId));
            // Make sure vessel was found
            if (vessel == null)
                throw new ArgumentException($"Vessel with id {options.VesselId} was not found in the requested game ({options.GameId})");
            // Get the player from existing list or create new
            PlayerJoinedGameDomainEvent playerJoinedGameEvent = null;
            var player = game.Players.FirstOrDefault(x => x.Id == playerId);
            if (player != null)
            {
                // Make sure the player doesn't already exist on a vessel (by matching player id to all vessel roles)
                var playerAlreadyOnAVessel = game.Vessels.Any(x =>
                    playerId.Equals(x.Captain?.Id ?? default(Guid)) ||
                    playerId.Equals(x.Radioman?.Id ?? default(Guid))
                );
                if (playerAlreadyOnAVessel)
                    throw new ArgumentException($"Player with id {playerId} already belongs to a vessel in the requested game ({options.GameId})");
            }
            else
            {
                // Create the player
                player = new Player(playerId, options.PlayerName);
                // Add to the game
                game.AddPlayer(player);
                // Set flag to raise event at the end of the operation
                playerJoinedGameEvent = PlayerJoinedGameDomainEvent.FromPlayerInGame(game, player);
            }
            // Build list of vessel roles to assign
            IEnumerable<VesselRole> vesselRoles = new List<VesselRole>();
            // If a vessel role list was provided, try to add the player into those roles (otherwise get default)
            if (options.VesselRoles.Any())
            {
                vesselRoles = options.VesselRoles.Select(x => VesselRole.FromName(x));
            }
            else
            {
                vesselRoles = GetDefaultVesselRolesForPlayer(vessel, player);
            }
            // Make sure we have at least one vessel role to assign
            if (!vesselRoles.Any())
                throw new ArgumentNullException(nameof(options.VesselRoles), "Can't add player to a vessel without specifying vessel role(s)");
            // If a vessel id was provided, we want to add the player onto the specified vessel
            var playerAddedToVesselRoleEvents = new List<PlayerAddedToVesselRoleDomainEvent>();
            // Add into specified vessel role(s)
            foreach (var vesselRole in vesselRoles)
            {
                // Set the role
                game.SetVesselRole(vessel.Id, vesselRole, player);
                // Store event to publish later
                playerAddedToVesselRoleEvents.Add(
                    PlayerAddedToVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                        game,
                        vessel,
                        vesselRole,
                        player
                    )
                );
            }
            // Raise event for player added into game
            if (playerJoinedGameEvent != null)
            {
                await _eventBus.PublishAsync(playerJoinedGameEvent);
            }
            // Raise event(s) for player added into role(s)
            foreach (var playerAddedToVesselRoleEvent in playerAddedToVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerAddedToVesselRoleEvent);
            }
            // Return the new vessel state
            return MapToVesselDto(vessel);
        }

        public async Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options)
        {
            // Make sure required arguments were provided
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            var vesselId = options?.VesselId != null ? options.VesselId : default(Guid);
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(options.VesselId));
            // Locate game matching id from request
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Locate vessel matching id from request
            var vessel = game.Vessels.FirstOrDefault(x => x.Id.Equals(vesselId));
            // Make sure vessel was found
            if (vessel == null)
                throw new ArgumentException($"Vessel with id {vesselId} was not found in the requested game ({gameId})");
            // Make sure player was found
            var player = game.Players.FirstOrDefault(x => x.Id == playerId);
            if (player == null)
                throw new ArgumentException($"Player with id {playerId} was not found in the requested game ({gameId})");
            // Make list of roles that player is being removed from
            var playerRemovedFromVesselRoleEvents = new List<PlayerRemovedFromVesselRoleDomainEvent>();
            // Player is Captain
            if ((vessel.Captain?.Id ?? Guid.Empty).Equals(playerId))
            {
                // Remove from the role
                vessel.SetVesselRole(VesselRole.Captain, null);
                // Store the event
                playerRemovedFromVesselRoleEvents.Add(
                    PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Captain,
                        player
                    )
                );
            }
            // Player is Radioman
            if ((vessel.Radioman?.Id ?? Guid.Empty).Equals(playerId))
            {
                // Remove from the role
                vessel.SetVesselRole(VesselRole.Radioman, null);
                // Store the event
                playerRemovedFromVesselRoleEvents.Add(
                    PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Radioman,
                        player
                    )
                );
            }
            // Raise event(s) for player removed from role(s)
            foreach (var playerRemovedFromVesselRoleEvent in playerRemovedFromVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerRemovedFromVesselRoleEvent);
            }
            // Return the updated vessel state
            return MapToVesselDto(vessel);
        }

        public async Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options)
        {
            // Make sure no arguments left blank
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            var vesselId = options?.VesselId != null ? options.VesselId : default(Guid);
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(options.VesselId));
            var vesselRoles = options.VesselRoles.Select(x => VesselRole.FromName(x));
            if (!vesselRoles.Any())
                throw new ArgumentNullException(nameof(options.VesselRoles));
            // Locate game matching id from request
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Locate vessel matching id from request
            var vessel = game.Vessels.FirstOrDefault(x => x.Id.Equals(vesselId));
            // Make sure vessel was found
            if (vessel == null)
                throw new ArgumentException($"Vessel with id {vesselId} was not found in the requested game ({gameId})");
            // Get the player from existing list or create new
            PlayerJoinedGameDomainEvent playerJoinedGameEvent = null;
            var player = game.Players.FirstOrDefault(x => x.Id == playerId);
            if (player != null)
            {
                // Make sure the player doesn't already exist in the vessel role (by matching player id)
                var playerAlreadyOnADifferentVessel = game.Vessels.Any(x =>
                    !vesselId.Equals(x.Id) &&
                    playerId.Equals(x.Captain?.Id ?? default(Guid)) ||
                    playerId.Equals(x.Radioman?.Id ?? default(Guid))
                );
                if (playerAlreadyOnADifferentVessel)
                    throw new ArgumentException($"Player with id {playerId} already belongs to another vessel in the requested game ({gameId})");
            }
            else
            {
                // Create the player
                player = new Player(playerId, options.PlayerName);
                // Add to the game
                game.AddPlayer(player);
                // Set flag to raise event at the end of the operation
                playerJoinedGameEvent = PlayerJoinedGameDomainEvent.FromPlayerInGame(game, player);
            }
            // Try to add player to each role in the list (if not already belonging to those roles)
            var playerAddedToVesselRoleEvents = new List<PlayerAddedToVesselRoleDomainEvent>();
            foreach (var vesselRole in vesselRoles)
            {
                // Captain
                if (vesselRole.Value == VesselRole.Captain.Value)
                {
                    // Check the current Captain
                    var vesselCaptain = vessel.Captain;
                    if ((vesselCaptain?.Id ?? Guid.Empty).Equals(playerId))
                        throw new ArgumentException($"Player with id {playerId} already belongs to role ({VesselRole.Captain.Name})");
                    // Assign to role
                    vessel.SetVesselRole(VesselRole.Captain, player);
                    // Store the event
                    playerAddedToVesselRoleEvents.Add(
                        PlayerAddedToVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Captain,
                            player
                        )
                    );
                }
                // Radioman
                if (vesselRole.Value == VesselRole.Radioman.Value)
                {
                    // Check the current Radioman
                    var vesselRadioman = vessel.Radioman;
                    if ((vesselRadioman?.Id ?? Guid.Empty).Equals(playerId))
                        throw new ArgumentException($"Player with id {playerId} already belongs to role ({VesselRole.Radioman.Name})");
                    // Assign to role
                    vessel.SetVesselRole(VesselRole.Radioman, player);
                    // Store the event
                    playerAddedToVesselRoleEvents.Add(
                        PlayerAddedToVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Radioman,
                            player
                        )
                    );
                }
            }
            // Raise event for player added into game
            if (playerJoinedGameEvent != null)
            {
                await _eventBus.PublishAsync(playerJoinedGameEvent);
            }
            // Raise event(s) for player added into role(s)
            foreach (var playerAddedToVesselRoleEvent in playerAddedToVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerAddedToVesselRoleEvent);
            }
            // Return the new vessel state
            return MapToVesselDto(vessel);
        }

        public async Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options)
        {
            // Make sure required arguments were provided
            var gameId = options?.GameId != null ? options.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(options.GameId));
            var playerId = options?.PlayerId != null ? options.PlayerId : default(Guid);
            if (playerId == default(Guid))
                throw new ArgumentNullException(nameof(options.PlayerId));
            var vesselId = options?.VesselId != null ? options.VesselId : default(Guid);
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(options.VesselId));
            var vesselRoles = options.VesselRoles.Select(x => VesselRole.FromName(x));
            if (!vesselRoles.Any())
                throw new ArgumentNullException(nameof(options.VesselRoles));
            // Locate game matching id from request
            var game = await RetrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
            // Locate vessel matching id from request
            var vessel = game.Vessels.FirstOrDefault(x => x.Id.Equals(vesselId));
            // Make sure vessel was found
            if (vessel == null)
                throw new ArgumentException($"Vessel with id {vesselId} was not found in the requested game ({gameId})");
            // Make sure player was found
            var player = game.Players.FirstOrDefault(x => x.Id.Equals(playerId));
            if (player == null)
                throw new ArgumentException($"Player with id {playerId} was not found in the requested game ({gameId})");
            // Make sure player belongs to each role in the list
            var playerRemovedFromVesselRoleEvents = new List<PlayerRemovedFromVesselRoleDomainEvent>();
            foreach (var vesselRole in vesselRoles)
            {
                // Captain
                if (vesselRole.Value == VesselRole.Captain.Value)
                {
                    // Check the current Captain
                    var vesselCaptain = vessel.Captain;
                    if (!(vesselCaptain?.Id ?? Guid.Empty).Equals(playerId))
                        throw new ArgumentException($"Player with id {playerId} does not belong to role ({VesselRole.Captain.Name})");
                    // Remove from role
                    vessel.SetVesselRole(VesselRole.Captain, null);
                    // Store the event
                    playerRemovedFromVesselRoleEvents.Add(
                        PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Captain,
                            player
                        )
                    );
                }
                // Radioman
                if (vesselRole.Value == VesselRole.Radioman.Value)
                {
                    // Check the current Radioman
                    var vesselRadioman = vessel.Radioman;
                    if (!(vesselRadioman?.Id ?? Guid.Empty).Equals(playerId))
                        throw new ArgumentException($"Player with id {playerId} does not belong to role ({VesselRole.Radioman.Name})");
                    // Remove from role
                    vessel.SetVesselRole(VesselRole.Radioman, null);
                    // Store the event
                    playerRemovedFromVesselRoleEvents.Add(
                        PlayerRemovedFromVesselRoleDomainEvent.FromPlayerInGameVesselRole(
                            game,
                            vessel,
                            VesselRole.Radioman,
                            player
                        )
                    );
                }
            }
            // Raise player removed from vessel role event(s)
            foreach (var playerRemovedFromVesselRoleEvent in playerRemovedFromVesselRoleEvents)
            {
                await _eventBus.PublishAsync(playerRemovedFromVesselRoleEvent);
            }
            // Return the updated vessel state
            return MapToVesselDto(vessel);
        }

        public async Task<VesselDto> MoveVesselAsync(VesselMoveRequest request)
        {
            // Locate game matching id from request
            var gameId = request?.GameId != null ? request.GameId : default(Guid);
            if (gameId == default(Guid))
                throw new ArgumentNullException(nameof(request.GameId));
            var game = await RetrieveGameByIdAsync(gameId);

            // Make sure we have a valid board
            var board = game?.Board;
            if (board == null)
                throw new KeyNotFoundException($"Game id '{gameId}' contains invalid board data!");

            // Locate vessel matching id from request
            var vesselId = request?.VesselId != null ? request.VesselId : default(Guid);
            if (vesselId == default(Guid))
                throw new ArgumentNullException(nameof(request.VesselId));
            var foundVessel = game.Vessels.SingleOrDefault(x => x.Id == vesselId);
            if (foundVessel == null)
                throw new KeyNotFoundException($"Could not locate vessel with id '{vesselId}'");
            var vessel = foundVessel;

            // Derive current coordinates from request
            var requestStartCoordinates = CubicCoordinates.FromOrderedTriple(request.SourceOrderedTriple);
            var actualStartCoordinates = vessel.CubicCoordinates;

            // Make sure starting position matches current known position for vessel
            if (!requestStartCoordinates.Equals(actualStartCoordinates))
                throw new InvalidOperationException("Requested vessel movement(s) must originate from current vessel position");
            var requestStartTile = board.Tiles.SingleOrDefault(x => requestStartCoordinates.Equals(x.CubicCoordinates));
            if (requestStartTile == null)
                throw new InvalidOperationException("Current vessel position does not match a corresponding tile");

            // Determine if request specifies only cardinal directions or an actual set of tile coordinates
            CubicCoordinates targetCoordinates = null;
            var doubleIncrement = game.Board.TileShape.DoubleIncrement;
            var useCardinalDirections = !request.TargetOrderedTriple.Any();
            Direction direction = null;
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
                // Determine cardinal direction (for event publishing)
                direction = GetDirectionFromTileMovement(game.Board, actualStartCoordinates, requestTargetCoordinates);
                // Use target coordinates from request
                targetCoordinates = requestTargetCoordinates;
            }
            else
            {
                // Get directions/movements
                direction = request.Direction ?? new Direction();
                var north = direction?.North ?? false;
                var south = direction?.South ?? false;
                var west = direction?.West ?? false;
                var east = direction?.East ?? false;
                // Determine movement based on cardinal direction(s)
                bool hasMovement = north || south || west || east;
                // If no movement (must move at least 1 unit), throw error
                if (!hasMovement)
                    throw new InvalidOperationException("Vessel movement must target a tile that is 1 unit away from current position");
                // Make sure we don't have any offsetting movements
                if ((north && south) || (west && east))
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
            vessel = game.Vessels.FirstOrDefault(x => x.Id.Equals(vesselId));
            await _eventBus.PublishAsync(VesselStateChangedDomainEvent.FromVesselInGame(game, vessel));
            await _eventBus.PublishAsync(VesselMovedInDirectionEvent.FromVesselDirectionInGame(game.Id, MapToVesselDto(vessel), direction));

            // Finished changing game state
            await _eventBus.PublishAsync(GameStateChangedDomainEvent.FromGame(game));

            // Return the new vessel state
            return MapToVesselDto(vessel);

        }

        private IEnumerable<Vessel> CreateVessels(IEnumerable<CreateVesselOptions> createVesselOptions, Board board)
        {
            var vessels = new List<Vessel>();
            foreach (var vesselOptions in createVesselOptions)
            {
                var vesselId = Guid.NewGuid();
                var vesselName = vesselOptions.RequestedName;
                var startingCoordinates = vesselOptions.StartOrderedTriple != null
                    ? CubicCoordinates.FromOrderedTriple(vesselOptions.StartOrderedTriple)
                    : board.GetRandomPassableCoordinates();
                var vessel = new Vessel(
                    id: vesselId,
                    name: vesselName,
                    cubicCoordinates: startingCoordinates,
                    captain: null,
                    radioman: null
                );
                vessels.Add(vessel);
            }
            return vessels;
        }

        private int GetTotalUnitDistance(bool doubleIncrement, CubicCoordinates fromTileCoordinates, CubicCoordinates toTileCoordinates)
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
            var doubleIncrement = board.TileShape.DoubleIncrement ;
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
            var doubleIncrement = board.TileShape.DoubleIncrement ;
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
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddYSubtractX(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddXSubtractY(doubleIncrement ? 2 : 1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetNorthWestTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddYSubtractZ(doubleIncrement ? 2 : 1);
            if (doubleIncrement)
                newCoordinates = newCoordinates.AddYSubtractX(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }


        private Tile GetSouthWestTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddZSubtractX(doubleIncrement ? 2 : 1);
            if (doubleIncrement)
                newCoordinates = newCoordinates.AddYSubtractX(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetNorthEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddXSubtractZ(doubleIncrement ? 2 : 1);
            if (doubleIncrement)
                newCoordinates = newCoordinates.AddXSubtractY(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Tile GetSouthEastTile(Board board, CubicCoordinates fromTileCoordinates)
        {
            var doubleIncrement = board.TileShape.DoubleIncrement ;
            CubicCoordinates newCoordinates = fromTileCoordinates
                .AddZSubtractY(doubleIncrement ? 2 : 1);
            if (doubleIncrement)
                newCoordinates = newCoordinates.AddXSubtractY(1);
            var getTile = board.GetTileFromCoordinates(newCoordinates);
            if (getTile == null)
                throw new Exception("No tile exists for the requested position/cordinates");
            return getTile;
        }

        private Direction GetDirectionFromTileMovement(Board board, CubicCoordinates fromTileCoordinates, CubicCoordinates toTileCoordinates) 
        {
            // TODO: Fix this dirty, shameful code
            if (board.TileShape.HasDirectionEast.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetEastTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { East = true };
            }
            if (board.TileShape.HasDirectionNorth.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetNorthTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { North = true };
            }
            if (board.TileShape.HasDirectionNorthEast.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetNorthEastTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { East = true, North = true };
            }
            if (board.TileShape.HasDirectionNorthWest.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetNorthWestTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { North = true, West = true };
            }
            if (board.TileShape.HasDirectionSouth.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetSouthTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { South = true };
            }
            if (board.TileShape.HasDirectionSouthEast.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetSouthEastTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { East = true, South = true };
            }
            if (board.TileShape.HasDirectionSouthWest.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetSouthWestTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { South = true, West = true };
            }
            if (board.TileShape.HasDirectionWest.GetValueOrDefault() && 
                toTileCoordinates.Equals(GetWestTile(board, fromTileCoordinates).CubicCoordinates)) {
                    return new Direction() { West = true };
            }
            throw new InvalidOperationException("Movement does not appear to be directional");
        }

    }
}