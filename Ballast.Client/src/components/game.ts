import { Game, GameStateChangedEvent, IEventBus, Tile, Vessel } from 'ballast-core';
import { inject, injectable } from 'inversify';
import * as THREE from 'three';
import * as uuid from 'uuid';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';
import { RenderingConstants } from '../rendering/rendering-constants';
import { RenderingContext } from '../rendering/rendering-context';
import { IGameClientService } from '../services/game-client-service';
import { BoardComponent } from './board';
import { ComponentBase } from './component-base';
import { WorldComponent } from './world';

@injectable()
export class GameComponent extends ComponentBase {

    // Vessel object(s)
    private readonly vessel: THREE.Mesh;
    private readonly vesselPivot: THREE.Object3D;

    // Buttons & click listeners
    private readonly clockwiseButton: HTMLButtonElement;
    private readonly clockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;
    private readonly counterClockwiseButton: HTMLButtonElement;
    private readonly counterClockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;

    // Rotation flags/triggers 
    private readonly rotationTarget: THREE.Object3D;
    private readonly rotationAnimationDuration: number;
    private rotationDirections: number;
    private rotationRadians: number;
    private rotationClock?: THREE.Clock;
    private rotationClockwise?: boolean;
    private triggerClockwiseRotation?: number;
    private triggerCounterClockwiseRotation?: number;

    // Current game / state
    private readonly gameService: IGameClientService;
    private readonly gameStateChangedHandler: (event: GameStateChangedEvent) => Promise<void>;
    private currentGame?: Game;
    private currentVessel?: Vessel;
    private currentTile?: Tile;

    // Child components
    private readonly world: WorldComponent;
    private readonly board: BoardComponent;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.IGameClientService) gameClientService: IGameClientService,
        @inject(TYPES_BALLAST.BoardComponentFactory) worldFactory: () => WorldComponent,
        @inject(TYPES_BALLAST.WorldComponentFactory) boardFactory: () => BoardComponent) {

        // base constructor
        super(viewport, eventBus, perspectiveTracker);

        // Create vessel 3d object(s)
        let vesselObjects = this.createVesselObjects();
        this.vessel = vesselObjects["0"];
        this.vesselPivot = vesselObjects["1"];

        // Create buttons & click listeners
        let buttons = this.createRotationButtons()
        this.counterClockwiseButton = buttons["0"];
        this.counterClockwiseClickListener = this.onCounterClockwiseClick.bind(this);
        this.clockwiseButton = buttons["1"];
        this.clockwiseClickListener = this.onClockwiseClick.bind(this);

        // Trigger(s) & properties for object rotation animation(s)
        this.rotationTarget = this.createRotationTarget();
        this.rotationAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this.rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this.rotationDirections = 8; // Default to 8 directions

        // Game state update listener
        this.gameService = gameClientService;
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);

        // Create child components
        this.world = worldFactory();
        this.board = boardFactory();

    }

    private createVesselObjects(): [THREE.Mesh, THREE.Object3D] {
        // Create vessel mesh
        let vesselGeometry = new THREE.DodecahedronGeometry(1);
        //let vesselGeometry = new THREE.SphereGeometry( 1, 24, 24 );
        let vesselMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        let vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
        // Create vessel parent/pivot object
        let vesselPivot = new THREE.Object3D();
        vesselPivot.position.set(0, 0, 0);
        vesselPivot.rotation.reorder('YXZ');
        vesselPivot.add(vessel);
        // Return all objects
        return [vessel, vesselPivot];
    }

    private createRotationTarget() {
        let rotationTarget = new THREE.Object3D();
        rotationTarget.rotation.reorder('YXZ');
        return rotationTarget;
    }

    private createRotationButtons(): [HTMLButtonElement, HTMLButtonElement] {

        // Add some CSS to the game style header tag for media query'ing the buttons
        let style = this.viewport.getGameStyle();
        let ownerDocument = style.ownerDocument;
        style.appendChild(ownerDocument.createTextNode(`
            .ballastRotateButton { 
                transform: rotate(180deg);
                position: absolute;
                color: white;
                background-color: transparent;
                border-width: 0px;
                border-style: solid;
                border-color: rgba(255, 255, 255, 0.1);
                text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                font-size: 5vw;
            } 
            @media screen and (min-width: 1000px) { 
                .ballastRotateButton { 
                    font-size: 50px;
                } 
            }
        `));

        // Counter clockwise button (top right)
        let counterClockwiseButton = ownerDocument.createElement('button');
        counterClockwiseButton.innerHTML = '&#8634';
        counterClockwiseButton.type = 'button';
        counterClockwiseButton.className = 'ballastRotateButton';
        counterClockwiseButton.style.cssFloat = 'left';
        counterClockwiseButton.style.top = '10%';
        counterClockwiseButton.style.left = '5.63%';

        // Counter clockwise button (top left)
        let clockwiseButton = ownerDocument.createElement('button');
        clockwiseButton.innerHTML = '&#8635';
        clockwiseButton.type = 'button';
        clockwiseButton.className = 'ballastRotateButton';
        clockwiseButton.style.cssFloat = 'right';
        clockwiseButton.style.top = '10%';
        clockwiseButton.style.right = '5.63%';

        // Return both buttons
        return [counterClockwiseButton, clockwiseButton];

    }

    private subscribeToEvents() {
        this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        this.counterClockwiseButton.addEventListener('click', this.counterClockwiseClickListener);
        this.clockwiseButton.addEventListener('click', this.clockwiseClickListener);
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        this.counterClockwiseButton.removeEventListener('click', this.counterClockwiseClickListener);
        this.clockwiseButton.removeEventListener('click', this.clockwiseClickListener);
    }

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Add camera as child of vessel & add vessel into secene
        renderingContext.scene.add(renderingContext.attachCameraToObject(this.vesselPivot));

        // Add buttons to parent element
        parent.appendChild(this.clockwiseButton);
        parent.appendChild(this.counterClockwiseButton);

        // Subscribe to click & domain events
        this.subscribeToEvents();

        // Attach child components
        this.board.attach(parent);
        this.world.attach(parent);

        // Notify game component finished loading
        this.eventBus.publishAsync(new GameComponentLoadedEvent());

        // Connect to the chat service/hub
        if (!this.gameService.isConnected) {
            this.gameService.connectAsync(); // Fire and forget
        }

    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Disconnect from the chat service/hub
        if (this.gameService.isConnected) {
            this.gameService.disconnectAsync(); // Fire and forget
        }

        // Remove camera pivot from the vessel object
        renderingContext.detachCameraFromObject(this.vesselPivot);

        // Remove buttons from parent element
        parent.removeChild(this.clockwiseButton);
        parent.removeChild(this.counterClockwiseButton);

        // Detach child components
        this.board.detach();
        this.world.detach();

        // Unsubscribe from click & domain events
        this.unsubscribeFromEvents();

    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Reset objects if we have a new game
        let isNewGame = (renderingContext.game && (!this.currentGame || this.currentGame.id != renderingContext.game.id)) || false;
        if (isNewGame) {
            this.resetGame(renderingContext);
        }

        // Get keyboard input
        let leftIsDown = renderingContext.keyboard.leftArrowIsDown();
        let rightIsDown = renderingContext.keyboard.rightArrowIsDown();
        let aIsDown = renderingContext.keyboard.aIsDown();
        let dIsDown = renderingContext.keyboard.dIsDown();

        // Apply rotation animation
        let left = leftIsDown || aIsDown || !!this.triggerCounterClockwiseRotation;
        let right = rightIsDown || dIsDown || !!this.triggerClockwiseRotation;
        this.applyRotation(renderingContext, left, right);

        // Trigger for movement
        let forward = (renderingContext.keyboard.upArrowIsDown() || renderingContext.keyboard.wIsDown());
        if (forward) {
            let increment = 0.2;
            let movement = new THREE.Vector3(0, 0, 0);
            if (forward)
                movement.add(this.perspectiveTracker.getForwardScaled(increment, this.vesselPivot, this.rotationDirections));
            //console.log(movement);
            this.vesselPivot.position.add(movement);
        }

        // Get total possible directions of movement
        //let directions = renderingContext.game && renderingContext.game.board.tileShape.possibleDirections || undefined;
        // TODO: This needs to be updated to trigger a movemement to an adjacent tile based on relative direction
        //       Relative direction can be retrieved from the perspective tracker using "getRotation()" (for a rotationMatrix4)
        //       Or from the rendering context by using 

        let test = (renderingContext.keyboard.shiftIsDown());
        if (test) {
            let sourceTile = [0, 0, 0]; //this.currentVessel.cubicOrderedTriple;
            let targetTile = [0, 0, 0]; //this.currentVessel.cubicOrderedTriple;
            let timestamp = new Date(Date.now());
            this.gameService.moveVesselAsync({
                gameId: uuid.v4(),
                boardId: uuid.v4(),
                vesselId: uuid.v4(),
                timestampText: timestamp.toISOString(),
                sourceOrderedTriple: sourceTile,
                targetOrderedTriple: targetTile
            });
        }

    }

    private resetGame(renderingContext: RenderingContext) {

        // Store info from new game state
        this.currentGame = <Game>renderingContext.game;
        this.currentVessel = this.currentGame && this.currentGame.vessels[0]; // TODO:  Fix this
        this.rotationDirections = this.currentGame && this.currentGame.board.tileShape.possibleDirections || 8;
        if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 6) {
            this.rotationRadians = RenderingConstants.SIXTH_TURN_RADIANS;
        } else if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 4) {
            this.rotationRadians = RenderingConstants.QUARTER_TURN_RADIANS;
        } else {
            this.rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
        }

        // Update vessel pivot orientation
        let initialY = RenderingConstants.INITIAL_ORIENTATION_RADIANS;
        this.vesselPivot.rotation.set(0, initialY, 0);
        this.rotationTarget.rotation.set(0, initialY, 0);

        // Update vessel properties
        this.vessel.position.set(0, 0, 0);
        this.vesselPivot.position.set(0, 0, 0);
    }

    private applyRotation(renderingContext: RenderingContext, left: boolean, right: boolean) {

        // Determine if we are mid-rotation 
        let midRotation = !!this.rotationClock;

        // Get time since last orbit adjustment (if applicable)
        let rotationDelta = 0;
        if (midRotation) {
            rotationDelta = (this.rotationClock as THREE.Clock).getDelta();
        }

        // Check if we need to trigger a new orbit
        let triggerNewRotation = !midRotation && (!right && left || !left && right);
        if (triggerNewRotation) {
            this.rotationClockwise = right;
            let thetaRadians = this.rotationRadians;
            if (this.rotationClockwise)
                thetaRadians *= -1;
            this.rotationClock = new THREE.Clock();
            this.rotationTarget.rotateY(thetaRadians);
            if (!!this.triggerClockwiseRotation && this.rotationClockwise) {
                this.triggerClockwiseRotation--;
            }
            if (!!this.triggerCounterClockwiseRotation && !this.rotationClockwise) {
                this.triggerCounterClockwiseRotation--;
            }
        }

        // If we need to adjust for seconds elapsed while mid-orbit
        if (rotationDelta > 0) {

            // Check if we have reached the end of the rotation animation (time)
            let totalOrbitDelta = (this.rotationClock as THREE.Clock).getElapsedTime();
            if (totalOrbitDelta >= (this.rotationAnimationDuration)) {

                // Move directly to final orientation
                this.vesselPivot.rotation.setFromVector3(
                    (<THREE.Object3D>this.rotationTarget).rotation.toVector3()
                );

                // finished rotating
                this.rotationClockwise = undefined;
                this.rotationClock = undefined;

            } else {

                // Calculate how much of a partial turn we need to rotate by
                let partialTurns = rotationDelta * (1 / this.rotationAnimationDuration);

                // Convert partial turns to radians
                let thetaRadians = partialTurns * this.rotationRadians;
                if (this.rotationClockwise)
                    thetaRadians *= -1;

                // Rotate our camera pivot object
                this.vesselPivot.rotateY(thetaRadians);

            }

        }

    }

    private onCounterClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerClockwiseRotation) {
            this.triggerClockwiseRotation--;
        } else {
            if (!this.triggerCounterClockwiseRotation) {
                this.triggerCounterClockwiseRotation = 0;
            }
            this.triggerCounterClockwiseRotation++;
        }
    }

    private onClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerCounterClockwiseRotation) {
            this.triggerCounterClockwiseRotation--;
        } else {
            if (!this.triggerClockwiseRotation) {
                this.triggerClockwiseRotation = 0;
            }
            this.triggerClockwiseRotation++;
        }
    }

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        console.log(event.game);
    }

}