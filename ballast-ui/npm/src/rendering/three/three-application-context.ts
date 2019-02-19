import { IBallastClientOptions, TYPES as BallastClient } from "ballast-client";
import { IDirection, IEventBus, IGameService, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { ApplicationContext } from '../../app/application-context';
import { ThreeRenderingContext } from './three-rendering-context';

const TILESHAPE_HEXAGON = "Hexagon";

@injectable()
export class ThreeApplicationContext extends ApplicationContext {

    protected _direction: IDirection | null;
    protected _directionModified: boolean;

    public constructor(
        @inject(BallastClient.DependencyInjection.IBallastClientOptions) clientOptions: IBallastClientOptions,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService
    ) {
        super(clientOptions, eventBus, gameService);
        this._direction = null;
        this._directionModified = false;
    }

    public get currentDirection(): IDirection | null {
        return this._direction || null;
    }

    public get currentDirectionModified(): boolean {
        return this._directionModified;
    }

    public resetModifiedFlags() {
        super.resetModifiedFlags();
        this._directionModified = false;
    }

    public refreshDirection(renderingContext: ThreeRenderingContext) {
        // Retain old direction for comparison
        let oldDirection = this._direction;
        this._directionModified = false;
        // If we don't have a game anymore (but we previously had a direction) assume it changed
        if (oldDirection && !this._game) {
            this._directionModified = true; 
        }
        // If we don't have a direction yet (but we previously had a game) it's safe to assume we have a new direction
        if (!oldDirection && this._game) {
            this._directionModified = true; 
        }
        // If we don't have a direction anymore (but we previously had a direction) assume it changed
        if (oldDirection && !this._direction) {
            this._directionModified = true; 
        }
        // If we don't have a direction yet (but we previously had a direction) it's safe to assume we have a new direction
        if (!oldDirection && this._direction) {
            this._directionModified = true; 
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
            this._directionModified = true;
        }
        // Update locally stored direction
        this._direction = direction;
    }

}