import { BoardType, CubicCoordinates, Game, GameStateChangedEvent, IEventBus, Vessel, VesselStateChangedEvent } from 'ballast-core';
import { inject, injectable } from 'inversify';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from '../rendering/rendering-constants';
import { RenderingContext } from '../rendering/rendering-context';
import { IGameClientService } from '../services/game-client-service';
import { ComponentBase } from './component-base';

@injectable()
export class NavigationComponent extends ComponentBase {

    private readonly navWindow: HTMLDivElement;
    private readonly navCoordinates: HTMLLabelElement;
    private readonly gameService: IGameClientService;
    private readonly gameStateChangedHandler: (evt: GameStateChangedEvent) => Promise<void>;
    private currentGame?: Game;
    private readonly vesselStateChangedHandler: (evt: VesselStateChangedEvent) => Promise<void>;
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
        this.gameService = gameClientService;
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);
        this.vesselStateChangedHandler = this.onVesselStateChangedAsync.bind(this);
    }

    private createNavElements(): [
        HTMLDivElement,
        HTMLLabelElement
    ] {

        let ownerDocument = this.viewport.getRoot().ownerDocument;

        let navWindow = ownerDocument.createElement("div");
        navWindow.style.cssFloat = 'left';
        navWindow.style.position = 'absolute';
        navWindow.style.zIndex = '1000';
        navWindow.style.left = '12px'; // parent has 2px border
        navWindow.style.bottom = '12px'; // parent has 2px border
        navWindow.style.height = '26px';
        navWindow.style.width = 'calc(15% - 2px)';
        navWindow.style.borderWidth = '1px';
        navWindow.style.borderStyle = 'none';
        navWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        let navCoordinates = ownerDocument.createElement("label");
        navCoordinates.style.cssFloat = 'bottom';
        navCoordinates.style.position = 'absolute';
        navCoordinates.style.zIndex = '1001';
        navCoordinates.style.left = '0px';
        navCoordinates.style.bottom = '0px';
        navCoordinates.style.height = '26px';
        navCoordinates.style.width = '100%';
        navCoordinates.style.backgroundColor = 'transparent'; //'rgba(0, 0, 0, 0.1)';
        navCoordinates.style.borderStyle = 'none'; //'solid';
        navCoordinates.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        navCoordinates.style.color = 'white';
        navWindow.appendChild(navCoordinates);

        // let navCompass = ownerDocument.createElement("div");
        // navCompass.style.cssFloat = "bottom";
        // navCompass.style.position = 'absolute';
        // navCompass.style.zIndex = '1002';
        // navCompass.style.left = '0px';
        // navCompass.style.bottom = '26px';
        // navCompass.style.height = 'calc(100% - 26px)';
        // navCompass.style.width = '100%';
        // navCompass.style.backgroundColor = 'transparent'; //'rgba(0, 0, 0, 0.1)';
        // navCompass.style.borderStyle = 'none'; //'solid';
        // navCompass.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        // navCompass.style.color = 'white';
        // navCompass.style.transition = `transform ${RenderingConstants.PIVOT_DURATION_SECONDS}s`;
        // navCompass.style.fontSize ='7.5vw';
        // navCompass.style.textAlign = 'center';
        // navCompass.innerHTML = '&#10050;';
        // navWindow.appendChild(navCompass);

        return [navWindow, navCoordinates];

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

        this.updateDisplayCoordinates();

    }

    private updateDisplayCoordinates() {
        let scalingFactor: number = 1;
        let boardType: BoardType;
        let cubicCoordinates: CubicCoordinates | undefined;
        if (this.currentGame) {
            boardType = this.currentGame.board.boardType;
            scalingFactor = this.currentGame.board.tileShape.doubleIncrement ? 2 : 1;
        } else {
            boardType = BoardType.RegularPolygon; // default
            scalingFactor = 1; // default
        }
        if (this.currentVessel) {
            cubicCoordinates = this.currentVessel.cubicCoordinates;
        }
        let coordinatesText = "";
        if (cubicCoordinates) {
            if (boardType.equals(BoardType.Rectangle)) {
                let offset = cubicCoordinates.toOffset();
                coordinatesText = `${offset.row / scalingFactor}, ${offset.col / scalingFactor}`;
            } else { // Default regular polygon
                let axial = cubicCoordinates.toAxial();
                coordinatesText = `${axial.x / scalingFactor}, ${axial.z / scalingFactor}`;
            }
        }
        this.navCoordinates.innerText = coordinatesText;
    }

}