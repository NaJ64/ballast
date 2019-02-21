import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { IDirection, IEventBus, IGameService, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { BallastAppContext } from "../app-context";
import { CurrentDirectionModifiedEvent } from "./events";
import { ThreeRenderingContext } from "./rendering/three-rendering-context";

const TILESHAPE_HEXAGON = "Hexagon";

@injectable()
export class ThreeBallastAppContext extends BallastAppContext {

    protected _direction: IDirection | null;

    public constructor(
        @inject(BallastClient.DependencyInjection.IBallastClientOptions) clientOptions: IBallastClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService
    ) {
        super(clientOptions, eventBus, gameService);
        this._direction = null;
    }

    public get currentDirection(): IDirection | null {
        return this._direction || null;
    }

    public async refreshDirectionAsync(renderingContext: ThreeRenderingContext) {
        // Retain old direction for comparison
        let oldDirection = this._direction;
        let directionModified = false;
        // If we don't have a game anymore (but we previously had a direction) assume it changed
        if (oldDirection && !this._game) {
            directionModified = true; 
        }
        // If we don't have a direction yet (but we previously had a game) it's safe to assume we have a new direction
        if (!oldDirection && this._game) {
            directionModified = true; 
        }
        // If we don't have a direction anymore (but we previously had a direction) assume it changed
        if (oldDirection && !this._direction) {
            directionModified = true; 
        }
        // If we don't have a direction yet (but we previously had a direction) it's safe to assume we have a new direction
        if (!oldDirection && this._direction) {
            directionModified = true; 
        }
        // Get the tile shape to assist with calculating cardinal direction off the perspective tracker
        let tileShape = this._game && this._game.board.tileShape || TILESHAPE_HEXAGON;
        let direction = renderingContext.perspectiveTracker.getCardinalDirection(tileShape);
        // Check if the direction changed
        if (oldDirection && (
            oldDirection.north != direction.north ||
            oldDirection.south != direction.south ||
            oldDirection.east != direction.east ||
            oldDirection.west != direction.west
        )) {
            directionModified = true;
        }
        // Update locally stored direction
        this._direction = direction;
        if (directionModified) {
            await this._eventBus.publishAsync(CurrentDirectionModifiedEvent.create());
        }
    }

}