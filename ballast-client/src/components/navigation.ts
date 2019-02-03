import { BoardType, CubicCoordinates, Game, GameStateChangedEvent, IDirection, IEventBus, TileShape, Vessel, VesselStateChangedEvent } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingContext } from '../rendering/rendering-context';
import { IGameClientService } from '../services/game-client-service';
import { ComponentBase } from './component-base';

@injectable()
export class NavigationComponent extends ComponentBase {

    private readonly navWindow: HTMLDivElement;
    private readonly navCoordinates: HTMLLabelElement;
    private readonly navCompass: HTMLLabelElement;
    private readonly gameService: IGameClientService;
    private readonly gameStateChangedHandler: (evt: GameStateChangedEvent) => Promise<void>;
    private readonly vesselStateChangedHandler: (evt: VesselStateChangedEvent) => Promise<void>;
    private currentDirection?: IDirection;
    private currentGame?: Game;
    private currentVessel?: Vessel;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.IGameClientService) gameClientService: IGameClientService
    ) {
        super(viewport, eventBus, perspectiveTracker);
        let navElements = this.createNavElements();
        this.navWindow = navElements["0"];
        this.navCoordinates = navElements["1"];
        this.navCompass = navElements["2"];
        this.gameService = gameClientService;
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);
        this.vesselStateChangedHandler = this.onVesselStateChangedAsync.bind(this);
    }

    private createNavElements(): [
        HTMLDivElement,
        HTMLLabelElement,
        HTMLLabelElement
    ] {

        let ownerDocument = this.viewport.getRoot().ownerDocument!;

        let navWindow = ownerDocument.createElement("div");
        navWindow.style.cssFloat = 'left';
        navWindow.style.position = 'absolute';
        navWindow.style.zIndex = '1000';
        navWindow.style.left = '12px';
        navWindow.style.bottom = '12px';
        navWindow.style.height = '49px';
        navWindow.style.width = 'calc(15% - 2px)';
        navWindow.style.borderWidth = '1px';
        navWindow.style.borderStyle = 'none';
        navWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        let navCoordinates = ownerDocument.createElement("label");
        navCoordinates.style.textShadow = '1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)';
        navCoordinates.style.cssFloat = 'bottom';
        navCoordinates.style.position = 'absolute';
        navCoordinates.style.zIndex = '1001';
        navCoordinates.style.left = '0px';
        navCoordinates.style.bottom = '0px';
        navCoordinates.style.height = '24px';
        navCoordinates.style.width = '100%';
        navCoordinates.style.backgroundColor = 'transparent';
        navCoordinates.style.borderStyle = 'none';
        navCoordinates.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        navCoordinates.style.color = 'white';
        navWindow.appendChild(navCoordinates);
        
        let navCompass = ownerDocument.createElement("label");
        navCompass.style.textShadow = '1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)';
        navCompass.style.cssFloat = "bottom";
        navCompass.style.position = 'absolute';
        navCompass.style.zIndex = '1002';
        navCompass.style.left = '0px';
        navCompass.style.bottom = '25px';
        navCompass.style.height = '24px';
        navCompass.style.width = '100%';
        navCompass.style.backgroundColor = 'transparent';
        navCompass.style.borderStyle = 'none';
        navCompass.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        navCompass.style.color = 'white';
        navWindow.appendChild(navCompass);

        return [navWindow, navCoordinates, navCompass];

    }

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Add chat window onto page
        parent.appendChild(this.navWindow);

        // Subscribe to events
        this.subscribeToEvents();

    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Remove buttons from parent element
        parent.removeChild(this.navWindow);

        // Unsubscribe from click & domain events
        this.unsubscribeFromEvents();

    }

    private subscribeToEvents() {
        this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        this.eventBus.subscribe(VesselStateChangedEvent.id, this.vesselStateChangedHandler);
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        this.eventBus.unsubscribe(VesselStateChangedEvent.id, this.vesselStateChangedHandler);
    }

    private async onGameStateChangedAsync(evt: GameStateChangedEvent): Promise<void> {
        // Always make sure to store the latest game state for the current game
        if (this.currentGame && evt.game && this.currentGame.id == evt.game.id) {
            this.currentGame = evt.game;
        }
    }

    private async onVesselStateChangedAsync(evt: VesselStateChangedEvent): Promise<void> {
        // Always make sure to store the latest vessel state for the current vessel
        if (this.currentVessel && this.currentVessel.id == evt.vessel.id) {
            this.currentVessel = evt.vessel;
        }
        this.updateDisplayCoordinates();
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Reset objects if we have a new game
        let isNewGame = (renderingContext.game && (!this.currentGame || this.currentGame.id != renderingContext.game.id)) || false;
        if (isNewGame) {
            this.resetGame(renderingContext);
        }

        // Check if our compass heading has changed
        let directionHasChanged = this.getDirectionHasChanged();
        if (directionHasChanged) {
            this.updateCompass();
        }

    }
    
    private resetGame(renderingContext: RenderingContext) {

        let clientId = this.viewport.getClientId();

        // Store info from new game state
        this.currentGame = <Game>renderingContext.game;
        this.currentVessel = this.currentGame && this.currentGame.vessels && this.currentGame.vessels
            .find(x =>
                (x.captain && x.captain.id == clientId) ||
                (x.radioman && x.radioman.id == clientId) ||
                false
            );
        this.currentDirection = undefined; // This will be fixed during the render loop

        this.updateDisplayCoordinates();
        this.updateCompass();

    }

    private getDirectionHasChanged() {
        // If we don't have a game
        if (!this.currentGame) {
            return !!this.currentDirection; // If we don't have a game anymore (but we previously had a direction) assume it changed
        }
        // If we do have a direction
        if (!this.currentDirection) {
            return !!this.currentGame; // If we don't have a direction yet (but we previously had a game) it's safe to assume we have a new direction
        }
        // Get the tile shape to assist with calculating cardinal direction off the perspective tracker
        let tileShape = this.currentGame.board.tileShape;
        let direction = this.perspectiveTracker.getCardinalDirection(tileShape);
        let directionChanged = true;
        if (
            this.currentDirection.north == direction.north &&
            this.currentDirection.south == direction.south &&
            this.currentDirection.east == direction.east &&
            this.currentDirection.west == direction.west
        ) {
            directionChanged = false;
        }
        return directionChanged;
    }

    private updateCompass() {
        if (!this.currentGame) {
            this.navCompass.innerText = "";
            return;
        }
        let tileShape = this.currentGame.board.tileShape;
        let direction = this.perspectiveTracker.getCardinalDirection(tileShape);
        let directionHeadingText = "";
        if (direction.north) {
            directionHeadingText += "N";
        }
        if (direction.south) {
            directionHeadingText += "S";
        }
        if (direction.west) {
            directionHeadingText += "W";
        }
        if (direction.east) {
            directionHeadingText += "E";
        }
        let symbol = "";
        if (!!directionHeadingText) {
            symbol = "&uarr; " 
        }
        this.navCompass.innerHTML = `${symbol}${directionHeadingText}`;
    }

    private updateDisplayCoordinates() {
        let scalingFactor: number = 1;
        let boardType: BoardType;
        let tileType: TileShape;
        let cubicCoordinates: CubicCoordinates | undefined;
        if (this.currentGame) {
            boardType = this.currentGame.board.boardType;
            tileType = this.currentGame.board.tileShape;
            scalingFactor = this.currentGame.board.tileShape.doubleIncrement ? 2 : 1;
        } else {
            boardType = BoardType.RegularPolygon; // default
            tileType = TileShape.Hexagon;
            scalingFactor = 1; // default
        }
        if (this.currentVessel) {
            cubicCoordinates = this.currentVessel.cubicCoordinates;
        }
        let coordinatesText = "";
        let northSouthInversion = -1;
        if (boardType.equals(BoardType.Rectangle)) {
            northSouthInversion = 1;
        }
        let useOffset = boardType.equals(BoardType.Rectangle) || tileType.equals(TileShape.Square) || tileType.equals(TileShape.Octagon);
        if (cubicCoordinates) {
            if (useOffset) {
                let offset = cubicCoordinates.toOffset();
                coordinatesText = `${(northSouthInversion * offset.row / scalingFactor)}, ${offset.col / scalingFactor}`;
            } else { // Default circle / hexagon
                let axial = cubicCoordinates.toAxial();
                coordinatesText = `${axial.x / scalingFactor}, ${northSouthInversion * axial.z / scalingFactor}`;
            }
        }
        this.navCoordinates.innerText = coordinatesText;
    }

}