import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { GameStateChangedDomainEvent } from "../../../domain/events/game-state-changed";
import { PlayerAddedToVesselRoleDomainEvent } from "../../../domain/events/player-added-to-vessel-role";
import { PlayerJoinedGameDomainEvent } from "../../../domain/events/player-joined-game";
import { PlayerLeftGameDomainEvent } from "../../../domain/events/player-left-game";
import { PlayerRemovedFromVesselRoleDomainEvent } from "../../../domain/events/player-removed-from-vessel-role";
import { PlayerSignedOutDomainEvent } from "../../../domain/events/player-signed-out";
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
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    public async moveVesselAsync(request: IVesselMoveRequest): Promise<IVesselDto> {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private createVessels(createVesselOptions: ICreateVesselOptions[], board: Board): Vessel[] {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getTotalUnitDistance(doubleIncrement: boolean, fromTileCoordinates: CubicCoordinates, toTileCoordinates: CubicCoordinates ): number {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getNorthTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getSouthTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getNorthWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getSouthWestTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getNorthEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }

    private getSouthEastTile(board: Board, fromTileCoordinates: CubicCoordinates): Tile {
        // TODO:  Implement this
        throw new Error("Not implemented");
    }
}