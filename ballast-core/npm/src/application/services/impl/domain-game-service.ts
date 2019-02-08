import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { GameStateChangedDomainEvent } from "../../../domain/events/game-state-changed";
import { PlayerAddedToVesselRoleDomainEvent } from "../../../domain/events/player-added-to-vessel-role";
import { PlayerJoinedGameDomainEvent } from "../../../domain/events/player-joined-game";
import { PlayerLeftGameDomainEvent } from "../../../domain/events/player-left-game";
import { PlayerRemovedFromVesselRoleDomainEvent } from "../../../domain/events/player-removed-from-vessel-role";
import { PlayerSignedOutDomainEvent } from "../../../domain/events/player-signed-out";
import { VesselStateChangedDomainEvent } from "../../../domain/events/vessel-state-changed";
import { Board } from "../../../domain/models/board";
import { BoardType } from "../../../domain/models/board-type";
import { CubicCoordinates } from "../../../domain/models/cubic-coordinates";
import { Game } from "../../../domain/models/game";
import { Player } from "../../../domain/models/player";
import { Tile } from "../../../domain/models/tile";
import { TileShape } from "../../../domain/models/tile-shape";
import { Vessel } from "../../../domain/models/vessel";
import { VesselRole } from "../../../domain/models/vessel-role";
import { IBoardGenerator } from "../../../domain/services/board-generator";
import { IEventBus } from "../../../messaging/event-bus";
import { Guid } from "../../../utility/guid";
import { ICreateVesselOptions } from "../../models";
import { IAddPlayerOptions } from "../../models/add-player-options";
import { ICreateGameOptions } from "../../models/create-game-options";
import { IGameDto } from "../../models/game-dto";
import { IRemovePlayerOptions } from "../../models/remove-player-options";
import { IVesselDto } from "../../models/vessel-dto";
import { IVesselMoveRequest } from "../../models/vessel-move-request";
import { IGameService } from "../game-service";

@injectable()
export class DomainGameService implements IGameService {

    private static DEFAULT_BOARD_SIZE: number = 5;
    private static DEFAULT_BOARD_TYPE: BoardType = BoardType.RegularPolygon;
    private static DEFAULT_TILE_SHAPE: TileShape = TileShape.Hexagon;

    private readonly _eventBus: IEventBus;
    private readonly _boardGenerator: IBoardGenerator;
    private readonly _games: Map<string, Game>;
    private _defaultGame!: Game;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Domain.IBoardGenerator) boardGenerator: IBoardGenerator
    ) {
        this._eventBus = eventBus;
        this._boardGenerator = boardGenerator;
        this._games = new Map<string, Game>();
        this.createDefaultGameAsync().then(x => this._defaultGame = x);
        this.onPlayerSignedOutAsync = this.onPlayerSignedOutAsync.bind(this);
        this._eventBus.subscribe<PlayerSignedOutDomainEvent>(
            PlayerSignedOutDomainEvent.id,
            this.onPlayerSignedOutAsync
        );
    }

    public dispose() {
        this._eventBus.unsubscribe(PlayerSignedOutDomainEvent.id, this.onPlayerSignedOutAsync);
        this._games.clear();
    }

    private mapToGameDto(game: Game): IGameDto {
        // TODO:  Make a game dto
        throw new Error("Not implemented.");
    }

    private mapToVesselDto(vessel: Vessel): IVesselDto {
        // TODO:  Make a vessel dto
        throw new Error("Not implemented.");
    }

    private async createDefaultGameAsync(): Promise<Game> {
        let gameOptions: ICreateGameOptions = {
            boardShape: TileShape.Hexagon.name,
            boardType: BoardType.RegularPolygon.name,
            boardSize: 7,
            landToWaterRatio: 0.333,
            vesselOptions: [
                { requestedName: "U-571" } as ICreateVesselOptions,
                { requestedName: "Red October" } as ICreateVesselOptions,
                { requestedName: "The Nautilus" } as ICreateVesselOptions
            ]
        };
        let defaultGame = await this.createGameInternalAsync(gameOptions);
        return defaultGame;
    }

    private async createGameInternalAsync(options: ICreateGameOptions): Promise<Game> {
        let gameId = Guid.newGuid();
        let useBoardSize = options.boardSize || DomainGameService.DEFAULT_BOARD_SIZE;
        if (useBoardSize % 2 == 0) {
            useBoardSize++;
        }
        let useBoardType = !!options.boardType
            ? BoardType.fromName(options.boardType)
            : DomainGameService.DEFAULT_BOARD_TYPE;
        let useTileShape = !!options.boardShape
            ? TileShape.fromName(options.boardShape)
            : DomainGameService.DEFAULT_TILE_SHAPE;
        let useLandToWaterRatio = options.landToWaterRatio || undefined;

        let board = this._boardGenerator.createBoard(
            Guid.newGuid(),
            useBoardType,
            useTileShape,
            useBoardSize,
            undefined,
            useLandToWaterRatio
        );

        let players: Player[] = [];
        let vessels: Vessel[] = this.createVessels(options.vesselOptions, board);
        let createdOnDate = new Date(Date.now());
        let game = new Game(
            gameId,
            board,
            vessels,
            players,
            createdOnDate
        );
        this._games.set(gameId, game);
        await this._eventBus.publishAsync(GameStateChangedDomainEvent.fromGame(game));
        return game;
    }

    private async onPlayerSignedOutAsync(evt: PlayerSignedOutDomainEvent): Promise<void> {
        let playerId = evt.player && evt.player.id;
        if (!playerId)
            return;
        for (let game of this._games.values()) {
            if (game.players.findIndex(x => x.id == playerId) < 0) {
                continue;
            }
            let removePlayerOptions: IRemovePlayerOptions = {
                playerId: playerId,
                gameId: game.id,
                vesselId: null,
                vesselRoles: []
            };
            await this.removePlayerFromGameAsync(removePlayerOptions);
        }
    }

    private retrieveGameByIdAsync(gameId: string): Promise<Game> {
        if (this._games.has(gameId)) {
            return Promise.resolve(this._games.get(gameId) as Game);
        }
        throw new Error(`No game found for id ${gameId}`);
    }

    private async removeGameByIdAsync(gameId: string): Promise<void> {
        let game = await this.retrieveGameByIdAsync(gameId);
        this._games.delete(gameId);
    }

    private getDefaultVesselRolesForPlayer(vessel: Vessel, player: Player): VesselRole[] {
        // TODO:  Update this method to only place player into a single role
        // Create role list
        var roles: VesselRole[] = [];
        // Return all the vessel roles that are empty
        if (!vessel.captain || !vessel.captain.id) {
            roles.push(VesselRole.Captain);
        }
        if (!vessel.radioman || !vessel.radioman.id) {
            roles.push(VesselRole.Radioman);
        }
        // Return the role list
        return roles;
    }

    public getTestGameIdAsync(): Promise<string> {
        if (!this._defaultGame) {
            throw new Error("Default game not yet set");
        }
        return Promise.resolve(this._defaultGame.id);
    }

    public async getAllGamesAsync(): Promise<IGameDto[]> {
        return Promise.resolve(
            Array.from(this._games.values())
                .map(x => this.mapToGameDto(x))
        );
    }

    public async getGameAsync(gameId: string): Promise<IGameDto> {
        return this.mapToGameDto(await this.retrieveGameByIdAsync(gameId));
    }

    public async createGameAsync(options: ICreateGameOptions): Promise<IGameDto> {
        return this.mapToGameDto(await this.createGameInternalAsync(options));
    }

    public async startGameAsync(gameId: string): Promise<IGameDto> {
        let game = await this.retrieveGameByIdAsync(gameId);
        game.start();
        return this.mapToGameDto(game);
    }

    public async endGameAsync(gameId: string): Promise<IGameDto> {
        let game = await this.retrieveGameByIdAsync(gameId);
        game.end();
        return this.mapToGameDto(game);
    }

    public async deleteGameAsync(gameId: string): Promise<void> {
        await this.removeGameByIdAsync(gameId);
    }

    public async addPlayerToGameAsync(options: IAddPlayerOptions): Promise<IGameDto> {
        // Make sure no arguments left blank
        let gameId = options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        // Locate game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // throws error if game does not exist
        // Make sure the player doesn't already exist (by matching id)
        let playerExists = game.players.some(x => x.id == playerId);
        if (playerExists) {
            throw new Error(`Player with id ${playerId} already belongs to the requested game (${gameId})`);
        }
        // Create the player and add to the game
        let player = new Player(playerId, options.playerName as string); // TODO:  Determine how to default the name
        game.addPlayer(player);
        // If a vessel id was provided, we want to add the player onto the specified vessel as well
        let playerAddedToVesselRoleEvents: PlayerAddedToVesselRoleDomainEvent[] = [];
        if (!!options.vesselId) {
            // Make sure the vessel exists
            let vesselId = options.vesselId;
            let vessel = game.vessels.find(x => x.id == vesselId);
            if (!vessel) {
                throw new Error(`Vessel with id ${vesselId} was not found in the requested game (${gameId})`);
            }
            let vesselRoles: VesselRole[] = [];
            if (options.vesselRoles && Array.isArray(options.vesselRoles) && options.vesselRoles.length) {
                vesselRoles = options.vesselRoles.map(x => VesselRole.fromName(x));
            } else {
                vesselRoles = this.getDefaultVesselRolesForPlayer(vessel, player);
            }
            // Make sure we have at least one vessel role
            if (!vesselRoles.length) {
                throw new Error(`Can't add player to a vessel without specifying vessel role(s)`);
            }
            // Add into specified vessel role(s)
            for (let vesselRole of vesselRoles) {
                // Set the role
                game.setVesselRole(vessel.id, vesselRole, player);
                // Store event to publish later
                playerAddedToVesselRoleEvents.push(
                    PlayerAddedToVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        vesselRole,
                        player
                    )
                );
            }
        }
        // Raise event for player added into game
        await this._eventBus.publishAsync(PlayerJoinedGameDomainEvent.fromPlayerInGame(
            game,
            player
        ));
        for (let playerAddedToVesselRoleEvent of playerAddedToVesselRoleEvents) {
            await this._eventBus.publishAsync(playerAddedToVesselRoleEvent);
        }
        // Return the updated game state
        return this.mapToGameDto(game);
    }

    public async removePlayerFromGameAsync(options: IRemovePlayerOptions) {
        // Make sure required arguments were provided
        let gameId = options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        // Get the game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // throws error if game is not found
        // Get the player matching id from request
        let player = game.players.find(x => x.id == playerId);
        if (!player) {
            throw new Error(`Player with id ${playerId} was not found in the requested game (${gameId})`);
        }
        // Make an event list for all of the vessel roles player is about to be removed from
        let playerRemovedFromVesselRoleEvents: PlayerRemovedFromVesselRoleDomainEvent[] = [];
        for (let vessel of game.vessels) {
            // player is the Captain
            if (vessel.captain && vessel.captain.id == player.id) {
                playerRemovedFromVesselRoleEvents.push(
                    PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Captain,
                        player
                    )
                );
            }
            // player is the radioman
            if (vessel.radioman && vessel.radioman.id == player.id) {
                playerRemovedFromVesselRoleEvents.push(
                    PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Radioman,
                        player
                    )
                );
            }
        }
        // Remove the player from the game
        game.removePlayer(player);
        // Raise event for player removed from vessel role
        for (let playerRemovedFromVesselRoleEvent of playerRemovedFromVesselRoleEvents) {
            await this._eventBus.publishAsync(playerRemovedFromVesselRoleEvent);
        }
        // Raise event for player left game
        await this._eventBus.publishAsync(PlayerLeftGameDomainEvent.fromPlayerInGame(
            game,
            player
        ));
        // Return the updated game state
        return this.mapToGameDto(game);
    }

    public async addPlayerToVesselAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        // Make sure required arguments were provided
        let gameId = options && options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        let vesselId = options.vesselId;
        if (!vesselId || vesselId == Guid.empty) {
            throw new Error("vesselId cannot be null");
        }
        // Locate game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
        // Locate vessel matching id from request
        let vessel = game.vessels.find(x => x.id == vesselId);
        // Make sure vessel was found
        if (!vessel) {
            throw new Error(`Vessel with id ${vesselId} was not found in the requested game (${gameId})`);
        }
        // Get the player from existing list or create new
        let playerJoinedGameEvent: PlayerJoinedGameDomainEvent | null = null;
        let player = game.players.find(x => x.id == playerId);
        if (player) {
            // Make sure the player doesn't already exist on a vessel (by matching player id to all vessel roles)
            let playerAlreadyOnAVessel = game.vessels.some(x => 
                !!((x.captain && x.captain.id == playerId) ||
                (x.radioman && x.radioman.id == playerId))
            );
            if (playerAlreadyOnAVessel) {
                throw new Error(`Player with id ${playerId} already belongs to a vessel in the requested game (${gameId})`)
            }
        } else {
            // Create the player
            player = new Player(playerId, options.playerName as string ); // TODO:  Determine how to default the name
            // Add to the game
            game.addPlayer(player);
            // Set flag to raise event at the end of the operation
            playerJoinedGameEvent = PlayerJoinedGameDomainEvent.fromPlayerInGame(
                game,
                player
            );
        }
        // Build list of vessel roles to assign
        let vesselRoles: VesselRole[] = [];
        // If a vessel role list was provided, try to add the player into those roles (otherwise get default)
        if (options.vesselRoles && Array.isArray(options.vesselRoles) && options.vesselRoles.length) {
            vesselRoles = options.vesselRoles.map(x => VesselRole.fromName(x));
        } else {
            vesselRoles = this.getDefaultVesselRolesForPlayer(vessel, player);
        }
        // Make sure we have at least one vessel role to assign
        if (!vesselRoles.length) {
            throw new Error("Can't add player to a vessel without specifying vessel role(s)");
        }
        // If a vessel id was provided we want to add the player onto the specified vessel
        let playerAddedToVesselRoleEvents: PlayerAddedToVesselRoleDomainEvent[] = [];
        // Add into specified vessel role(s)
        for(let vesselRole of vesselRoles) {
            // Set the role
            game.setVesselRole(vessel.id, vesselRole, player);
            // Store event to publish later
            playerAddedToVesselRoleEvents.push(
                PlayerAddedToVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                    game,
                    vessel,
                    vesselRole,
                    player
                )
            );
        }
        // Raise event for player added into game
        if (playerJoinedGameEvent) {
            await this._eventBus.publishAsync(playerJoinedGameEvent);
        }
        // Raise event(s) for player added into role(s)
        for(let playerAddedToVesselRoleEvent of playerAddedToVesselRoleEvents) {
            await this._eventBus.publishAsync(playerAddedToVesselRoleEvent);
        }
        // Return the new vessel state
        return this.mapToVesselDto(vessel);
    }

    public async removePlayerFromVesselAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        // Make sure required arguments were provided
        let gameId = options && options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        let vesselId = options.vesselId;
        if (!vesselId || vesselId == Guid.empty) {
            throw new Error("vesselId cannot be null");
        }
        // Locate game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
        // Locate vessel matching id from request
        let vessel = game.vessels.find(x => x.id == vesselId);
        // Make sure vessel was found
        if (!vessel) {
            throw new Error(`Vessel with id ${vesselId} was not found in the requested game (${gameId})`);
        }
        // Make sure player was found
        let player = game.players.find(x => x.id == playerId);
        if (!player) {
            throw new Error(`Player with id ${playerId} was not found in the requested game (${gameId})`);
        }
        // Make list of roles that player is being removed from
        let playerRemovedFromVesselRoleEvents: PlayerRemovedFromVesselRoleDomainEvent[] = [];
        // Player is captain
        if (vessel.captain && vessel.captain.id == player.id) {
            // Remove from the role
            vessel.setVesselRole(VesselRole.Captain, null);
            // Store the event
            playerRemovedFromVesselRoleEvents.push(
                PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                    game,
                    vessel,
                    VesselRole.Captain,
                    player
                )
            );
        }
        // player is the radioman
        if (vessel.radioman && vessel.radioman.id == player.id) {
            // Remove from the role
            vessel.setVesselRole(VesselRole.Radioman, null);
            // Store the event
            playerRemovedFromVesselRoleEvents.push(
                PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                    game,
                    vessel,
                    VesselRole.Radioman,
                    player
                )
            );
        }
        // Raise event(s) for player removed from role(s)
        for(let playerRemovedFromVesselRoleEvent of playerRemovedFromVesselRoleEvents) {
            await this._eventBus.publishAsync(playerRemovedFromVesselRoleEvent);
        }
        // Return the updated vessel state
        return this.mapToVesselDto(vessel);
    }

    public async addPlayerToVesselRoleAsync(options: IAddPlayerOptions): Promise<IVesselDto> {
        // Make sure required arguments were provided
        let gameId = options && options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        let vesselId = options.vesselId;
        if (!vesselId || vesselId == Guid.empty) {
            throw new Error("vesselId cannot be null");
        }
        let hasVesselRoles = options.vesselRoles && Array.isArray(options.vesselRoles) && options.vesselRoles.length;
        if (!hasVesselRoles) {
            throw new Error("vesselRoles cannot be null/empty");
        }
        let vesselRoles = options.vesselRoles.map(x => VesselRole.fromName(x));
        // Locate game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
        // Locate vessel matching id from request
        let vessel = game.vessels.find(x => x.id == vesselId);
        // Make sure vessel was found
        if (!vessel) {
            throw new Error(`Vessel with id ${vesselId} was not found in the requested game (${gameId})`);
        }
        // Get the player from existing list or create new 
        let playerJoinedGameEvent: PlayerJoinedGameDomainEvent | null = null;
        let player = game.players.find(x => x.id == playerId);
        if (player) {
            // Make sure the player doesn't already exist in the vessel role (by matching player id)
            let playerAlreadyOnADifferentVessel = game.vessels.some(x => 
                (vesselId != x.id) &&
                !!((x.captain && x.captain.id == playerId) ||
                (x.radioman && x.radioman.id == playerId))
            );
            if (playerAlreadyOnADifferentVessel) {
                throw new Error(`Player with id ${playerId} already belongs to another vessel in the requested game (${gameId})`);
            }
        } else {
            // Create the player
            player = new Player(playerId, options.playerName as string); // TODO:  Determine how to default the name
            // Add to the game
            game.addPlayer(player);
            // Set flag to raise event at the end of the operation
            playerJoinedGameEvent = PlayerJoinedGameDomainEvent.fromPlayerInGame(game, player);
        }
        // Try to add player to each role in the list (if not already belonging to those roles)
        let playerAddedToVesselRoleEvents: PlayerAddedToVesselRoleDomainEvent[] = [];
        for(let vesselRole of vesselRoles) {
            // Captain
            if (vesselRole.value == VesselRole.Captain.value) {
                // Check the current Captain
                let vesselCaptain = vessel.captain;
                if (vesselCaptain && vesselCaptain.id == playerId) {
                    throw new Error(`Player with id ${playerId} already belongs to role (${VesselRole.Captain.name})`);
                }
                // Assign to role
                vessel.setVesselRole(VesselRole.Captain, player);
                // Store the event
                playerAddedToVesselRoleEvents.push(
                    PlayerAddedToVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Captain,
                        player
                    )
                );
            }
            // Radioman
            if (vesselRole.value == VesselRole.Radioman.value) {
                // Check the current Radioman
                let vesselRadioman = vessel.radioman;
                if (vesselRadioman && vesselRadioman.id == playerId) {
                    throw new Error(`Player with id ${playerId} already belongs to role (${VesselRole.Captain.name})`);
                }
                // Assign to role
                vessel.setVesselRole(VesselRole.Radioman, player);
                // Store the event
                playerAddedToVesselRoleEvents.push(
                    PlayerAddedToVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Radioman,
                        player
                    )
                );
            }
        }
        // Raise event for player added into game
        if (playerJoinedGameEvent) {
            await this._eventBus.publishAsync(playerJoinedGameEvent);
        }    
        // Raise event(s) for player added into role(s)
        for(let playerAddedToVesselRoleEvent of playerAddedToVesselRoleEvents) {
            await this._eventBus.publishAsync(playerAddedToVesselRoleEvent);
        }
        // Return the new vessel state
        return this.mapToVesselDto(vessel);
    }

    public async removePlayerFromVesselRoleAsync(options: IRemovePlayerOptions): Promise<IVesselDto> {
        // Make sure required arguments were provided
        let gameId = options && options.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("gameId cannot be null");
        }
        let playerId = options.playerId;
        if (!playerId || playerId == Guid.empty) {
            throw new Error("playerId cannot be null");
        }
        let vesselId = options.vesselId;
        if (!vesselId || vesselId == Guid.empty) {
            throw new Error("vesselId cannot be null");
        }
        let hasVesselRoles = options.vesselRoles && Array.isArray(options.vesselRoles) && options.vesselRoles.length;
        if (!hasVesselRoles) {
            throw new Error("vesselRoles cannot be null/empty");
        }
        let vesselRoles = options.vesselRoles.map(x => VesselRole.fromName(x));
        // Locate game matching id from request
        let game = await this.retrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
        // Locate vessel matching id from request
        let vessel = game.vessels.find(x => x.id == vesselId);
        // Make sure vessel was found
        if (!vessel) {
            throw new Error(`Vessel with id ${vesselId} was not found in the requested game (${gameId})`);
        }
        // Make sure player was found
        let player = game.players.find(x => x.id == playerId);
        if (!player) {
            throw new Error(`Player with id ${playerId} was not found in the requested game (${gameId})`);
        }
        // Make sure player belongs to each role in the list
        let playerRemovedFromVesselRoleEvents: PlayerRemovedFromVesselRoleDomainEvent[] = [];
        for(let vesselRole of vesselRoles) {
            // Captain
            if (vesselRole.value == VesselRole.Captain.value) {
                // Check the current Captain
                let vesselCaptain = vessel.captain;
                if (vesselCaptain && vesselCaptain.id == playerId) {
                    throw new Error(`Player with id ${playerId} already belongs to role (${VesselRole.Captain.name})`);
                }
                // Remove from role
                vessel.setVesselRole(VesselRole.Captain, null);
                // Store the event
                playerRemovedFromVesselRoleEvents.push(
                    PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Captain,
                        player
                    )
                );
            }
            // Radioman
            if (vesselRole.value == VesselRole.Radioman.value) {
                // Check the current Radioman
                let vesselRadioman = vessel.radioman;
                if (vesselRadioman && vesselRadioman.id == playerId) {
                    throw new Error(`Player with id ${playerId} already belongs to role (${VesselRole.Captain.name})`);
                }
                // Remove from role
                vessel.setVesselRole(VesselRole.Radioman, null);
                // Store the event
                playerRemovedFromVesselRoleEvents.push(
                    PlayerRemovedFromVesselRoleDomainEvent.fromPlayerInGameVesselRole(
                        game,
                        vessel,
                        VesselRole.Radioman,
                        player
                    )
                );
            }
        }
        // Raise player removed from vessel role event(s)
        for(let playerRemovedFromVesselRoleEvent of playerRemovedFromVesselRoleEvents) {
            await this._eventBus.publishAsync(playerRemovedFromVesselRoleEvent);
        }
        // Return the updated vessel state
        return this.mapToVesselDto(vessel);
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto> {
        // Locate game matching id from request
        let gameId = request.gameId;
        if (!gameId || gameId == Guid.empty) {
            throw new Error("GameId must be provided");
        }
        let game = await this.retrieveGameByIdAsync(gameId); // <-- Throws exception if game not found
        
        // Make sure we have a valid board
        let board = game.board;
        if (!board) {
            throw new Error(`Game id ${gameId} contains invalid board data!`);
        }

        // Locate vessel matching id from request
        let vesselId = request && request.vesselId || null;
        if (!vesselId || vesselId == Guid.empty) {
            throw new Error("VesselId must be provided");
        }
        let foundVessel = game.vessels.find(x => x.id == vesselId);
        if (!foundVessel) {
            throw new Error(`Could not locate vessel with id '${vesselId}'`);
        }
        let vessel = foundVessel;

        // Derive current coordinates from request
        let requestStartCoordinates = CubicCoordinates.fromOrderedTriple(request.sourceOrderedTriple);
        let actualStartCoordinates = vessel.cubicCoordinates;

        // Make sure starting position matches current known position for vessel
        if (!requestStartCoordinates.equals(actualStartCoordinates)) {
            throw new Error(`Request vessel movement(s) must originate from current vessel position`);
        }
        let requestStartTile = board.tiles.find(x => requestStartCoordinates.equals(x.cubicCoordinates));
        if (!requestStartTile) {
            throw new Error("Current vessel position does not match a corresponding tile");
        }

        // Determine if request specifies only cardinal directions or an actual set of tile coordinates
        let targetCoordinates: CubicCoordinates | null = null;
        let doubleIncrement = !!game.board.tileShape.doubleIncrement;
        let useCardinalDirections = !!request.targetOrderedTriple && Array.isArray(request.targetOrderedTriple) && !!request.targetOrderedTriple.length;
        if (!useCardinalDirections) {
            // Get actual cubic coordinates
            let requestTargetCoordinates = CubicCoordinates.fromOrderedTriple(request.targetOrderedTriple);
            // Verify that the target coordinates are one movement away from the current coordinates
            let totalUnitDistance = this.getTotalUnitDistance(
                doubleIncrement,
                actualStartCoordinates,
                requestTargetCoordinates
            );
            // Can't move multiple units and also must move at least 1 unit
            if (totalUnitDistance != 1) {
                throw new Error(`Vessel movement must target a tile that is 1 unit away from current position`);
            }
            // Use target coordinates from request
            targetCoordinates = requestTargetCoordinates;
        } else {
            // Get directions/movements
            let north = request.direction && request.direction.north || false;
            let south = request.direction && request.direction.south || false;
            let west = request.direction && request.direction.west || false;
            let east = request.direction && request.direction.east || false;
            // Determine movement based on cardinal direction(s)
            let hasMovement = north || south || west || east;
            // If no movement (must move at least 1 unit), throw error
            if (!hasMovement) {
                throw new Error(`Vessel movement must target a tile that is 1 unit away from current position`);
            }
            // Make sure we don't have any offsetting movements
            if ((north && south) || (west && east)) {
                throw new Error(`Vessel movement may not specify opposite cardinal directions at the same time`);
            }
            // Calculate combined (diagonal) directions
            let northWest = north && west;
            let southWest = south && west;
            let northEast = north && east;
            let southEast = south && east;
            // After assigning diagonals, reduce "due-____" directions
            north = north && (!northWest && !northEast);
            south = south && (!southWest && !southEast);
            west = west && (!northWest && !southWest);
            east = east && (!northEast && !southEast);
            // Make sure the movement direction(s) are allowed by the current board/tile shape
            // Make sure the movement direction(s) are allowed by the current board/tile shape
            let boardTileShape = board && board.tileShape;
            if (!boardTileShape) {
                throw new Error("Board does not have tile shape information to determine valid movements");
            }
            if (north && (!boardTileShape.hasDirectionNorth))
                throw new Error("Current board/tile shape does not permit due North movement(s)");
            if (south && (!boardTileShape.hasDirectionSouth))
                throw new Error("Current board/tile shape does not permit due South movement(s)");
            if (west && (!boardTileShape.hasDirectionWest))
                throw new Error("Current board/tile shape does not permit due West movement(s)");
            if (east && (!boardTileShape.hasDirectionEast))
                throw new Error("Current board/tile shape does not permit due East movement(s)");
            if (northWest && (!boardTileShape.hasDirectionNorthWest))
                throw new Error("Current board/tile shape does not permit North-West movement(s)");
            if (southWest && (!boardTileShape.hasDirectionSouthWest))
                throw new Error("Current board/tile shape does not permit South-West movement(s)");
            if (northEast && (!boardTileShape.hasDirectionNorthEast))
                throw new Error("Current board/tile shape does not permit North-East movement(s)");
            if (southEast && (!boardTileShape.hasDirectionSouthEast))
                throw new Error("Current board/tile shape does not permit South East movement(s)");
            // Get the adjacent tile
            let targetTile: Tile | null = null;
            if (north) {
                targetTile = this.getNorthTile(board, requestStartCoordinates);
            } else if (south) {
                targetTile = this.getSouthTile(board, requestStartCoordinates);
            } else if (west) {
                targetTile = this.getWestTile(board, requestStartCoordinates);
            } else if (east) {
                targetTile = this.getEastTile(board, requestStartCoordinates);
            } else if (northWest) {
                targetTile = this.getNorthWestTile(board, requestStartCoordinates);
            } else if (southWest) {
                targetTile = this.getSouthWestTile(board, requestStartCoordinates);
            } else if (northEast) {
                targetTile = this.getNorthEastTile(board, requestStartCoordinates);
            } else if (southEast) {
                targetTile = this.getSouthEastTile(board, requestStartCoordinates);
            }
            // Make sure we obtained a valid tile, otherwise keep the vessel where it already is 
            if (!targetTile) {
                targetTile = requestStartTile;
            }
            // Get new coordinates
            targetCoordinates = targetTile.cubicCoordinates;
        }

        // Move the vessel to the new coordinates
        game.updateVesselCoordinates(vesselId, targetCoordinates);
        vessel = game.vessels.find(x => x.id == vesselId) as Vessel;
        await this._eventBus.publishAsync(VesselStateChangedDomainEvent.fromVesselInGame(game, vessel));

        // Finished changing game state
        await this._eventBus.publishAsync(GameStateChangedDomainEvent.fromGame(game));

        // Return the new vessel state
        return this.mapToVesselDto(vessel);

    }

    private createVessels(createVesselOptions: ICreateVesselOptions[], board: Board): Vessel[] {
        let vessels: Vessel[] = [];
        for(let vesselOptions of createVesselOptions) {
            let vesselId = Guid.newGuid();
            let vesselName = vesselOptions.requestedName;
            let startingCoordinates = !!vesselOptions.startOrderedTriple
                ? CubicCoordinates.fromOrderedTriple(vesselOptions.startOrderedTriple)
                : board.getRandomPassableCoordinates();
            let vessel = new Vessel(
                vesselId,
                vesselName,
                startingCoordinates,
                null,
                null
            );
            vessels.push(vessel);
        }
        return vessels;
    }

    private getTotalUnitDistance(doubleIncrement: boolean, fromTileCoordinates: CubicCoordinates, toTileCoordinates: CubicCoordinates ): number {
        let x1 = fromTileCoordinates.x;
        let y1 = fromTileCoordinates.y;
        let z1 = fromTileCoordinates.z;
        let x2 = toTileCoordinates.x;
        let y2 = toTileCoordinates.y;
        let z2 = toTileCoordinates.z;
        let distance = Math.max(Math.max(x2 - x1, y2 - y1), z2 - z1);
        if (doubleIncrement) {
            return Math.trunc(distance / 2);
        }
        return distance;
    }

    private getNorthTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        if (!doubleIncrement)
            throw new Error("Grid coordinate system does not support movement north without double-incrementation");
        var newCoordinates = fromTileCoordinates
            .addXSubtractZ(1)
            .addYSubtractZ(1);
        var getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getSouthTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        if (!doubleIncrement)
            throw new Error("Grid coordinate system does not support movement north without double-incrementation");
        var newCoordinates = fromTileCoordinates
            .addZSubtractX(1)
            .addZSubtractY(1);
        var getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addYSubtractX(doubleIncrement ? 2 : 1);
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addXSubtractY(doubleIncrement ? 2 : 1);
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getNorthWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addYSubtractZ(doubleIncrement ? 2 : 1);
        if (doubleIncrement) {
            newCoordinates = newCoordinates.addYSubtractX(1);
        }
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getSouthWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addZSubtractX(doubleIncrement ? 2 : 1);
        if (doubleIncrement) {
            newCoordinates = newCoordinates.addYSubtractX(1);
        }
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getNorthEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addXSubtractZ(doubleIncrement ? 2 : 1);
        if (doubleIncrement) {
            newCoordinates = newCoordinates.addXSubtractY(1);
        }
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }

    private getSouthEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        let doubleIncrement = board.tileShape.doubleIncrement || false;
        let newCoordinates = fromTileCoordinates
            .addZSubtractY(doubleIncrement ? 2 : 1);
        if (doubleIncrement) {
            newCoordinates = newCoordinates.addXSubtractY(1);
        }
        let getTile = board.getTileFromCoordinates(newCoordinates);
        if (getTile == null)
            throw new Error("No tile exists for the requested position/cordinates");
        return getTile;
    }
    
}