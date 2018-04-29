import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { Game, Tile, Vessel } from 'ballast-core';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingConstants } from '../rendering/rendering-constants';
import { RenderingContext } from '../rendering/rendering-context';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { BoardComponent } from './board';
import { WorldComponent } from './world';

@injectable()
export class GameComponent extends ComponentBase {

    // Services / child components
    private readonly world: WorldComponent;
    private readonly board: BoardComponent;

    // Current game / state
    private currentGame?: Game;
    private currentVessel?: Vessel;
    private currentTile?: Tile;

    // Vessel object(s)
    private readonly vessel: THREE.Mesh;
    private readonly vesselPivot: THREE.Object3D;
    private readonly vesselPivotTarget: THREE.Object3D;

    // Rotation flags/triggers 
    private readonly gameStateChangedHandler: (event: GameStateChangedEvent) => Promise<void>;
    private rotationDirections: number;
    private resetAllObjects: boolean;
    private rotationRadians: number;
    private rotationClock?: THREE.Clock;
    private rotateClockwise?: boolean;
    private rotationAnimationDuration: number;
    private triggerClockwise?: number;
    private triggerCounterClockwise?: number;

    // Clockwise button
    private clockwiseButton: HTMLButtonElement;
    private readonly clockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;

    // Counter-clockwise button
    private counterClockwiseButton: HTMLButtonElement;
    private readonly counterClockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker,
        @inject(TYPES_BALLAST.BoardComponentFactory) worldFactory: () => WorldComponent,
        @inject(TYPES_BALLAST.WorldComponentFactory) boardFactory: () => BoardComponent) {

        // base constructor
        super(viewport, eventBus, perspectiveTracker);

        // Create vessel 3d object(s)
        let vesselObjects = this.createVesselObjects();
        this.vessel = vesselObjects["0"];
        this.vesselPivot = vesselObjects["1"];
        this.vesselPivotTarget = vesselObjects["2"];

        // Create buttons & click listeners
        let buttons = this.createRotationButtons()
        this.counterClockwiseButton = buttons["0"];
        this.counterClockwiseClickListener = this.onCounterClockwiseClick.bind(this);
        this.clockwiseButton = buttons["1"];
        this.clockwiseClickListener = this.onClockwiseClick.bind(this);
        
        // Trigger(s) for object rotation reset / initial positioning
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);
        this.rotationAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this.rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this.rotationDirections = 8; // Default to 8 directions
        this.resetAllObjects = true;

        // Create child components
        this.world = worldFactory();
        this.board = boardFactory();

    }

    private createVesselObjects(): [THREE.Mesh, THREE.Object3D, THREE.Object3D] {
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
        // Create vessel pivot rotation target object
        let vesselPivotTarget = new THREE.Object3D();
        vesselPivotTarget.rotation.reorder('YXZ');
        // Return all objects
        return [vessel, vesselPivot, vesselPivotTarget];
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

    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {

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
        if (isNewGame || this.resetAllObjects) {
            this.resetGame(renderingContext);
        }

        // Get keyboard input
        let leftIsDown = renderingContext.keyboard.leftArrowIsDown();
        let rightIsDown = renderingContext.keyboard.rightArrowIsDown();
        let aIsDown = renderingContext.keyboard.aIsDown();
        let dIsDown = renderingContext.keyboard.dIsDown();

        // Apply rotation animation
        let left = leftIsDown || aIsDown || !!this.triggerCounterClockwise;
        let right = rightIsDown || dIsDown || !!this.triggerClockwise;
        this.applyRotation(renderingContext, left, right);

        // Get total possible directions of movement
        //let directions = renderingContext.game && renderingContext.game.board.tileShape.possibleDirections || undefined;
        // TODO: This needs to be updated to trigger a movemement to an adjacent tile based on relative direction
        //       Relative direction can be retrieved from the perspective tracker using "getRotation()" (for a rotationMatrix4)
        //       Or from the rendering context by using 

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

    }

    private resetGame(renderingContext: RenderingContext) {
        this.currentGame = <Game>renderingContext.game;
        this.rotationDirections = this.currentGame && this.currentGame.board.tileShape.possibleDirections || 8;
        if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 6) {
            this.rotationRadians = RenderingConstants.SIXTH_TURN_RADIANS;
        } else if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 4) {
            this.rotationRadians = RenderingConstants.QUARTER_TURN_RADIANS;
        } else {
            this.rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
        }
        this.vessel.position.set(0, 0, 0);
        let initialY = RenderingConstants.INITIAL_ORIENTATION_RADIANS;
        this.vesselPivot.rotation.set(0, initialY, 0);
        this.vesselPivotTarget.rotation.set(0, initialY, 0);
        this.resetAllObjects = false;
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
            this.rotateClockwise = right;
            let thetaRadians = this.rotationRadians;
            if (this.rotateClockwise)
                thetaRadians *= -1;
            this.rotationClock = new THREE.Clock();
            this.vesselPivotTarget.rotateY(thetaRadians);
            if (!!this.triggerClockwise && this.rotateClockwise) {
                this.triggerClockwise--;
            }
            if (!!this.triggerCounterClockwise && !this.rotateClockwise) {
                this.triggerCounterClockwise--;
            }
        }

        // If we need to adjust for seconds elapsed while mid-orbit
        if (rotationDelta > 0) {

            // Check if we have reached the end of the rotation animation (time)
            let totalOrbitDelta = (this.rotationClock as THREE.Clock).getElapsedTime();
            if (totalOrbitDelta >= (this.rotationAnimationDuration)) {

                // Move directly to final orientation
                this.vesselPivot.rotation.setFromVector3(
                    (<THREE.Object3D>this.vesselPivotTarget).rotation.toVector3()
                );

                // finished rotating
                this.rotateClockwise = undefined;
                this.rotationClock = undefined;

            } else {

                // Calculate how much of a partial turn we need to rotate by
                let partialTurns = rotationDelta * (1 / this.rotationAnimationDuration);

                // Convert partial turns to radians
                let thetaRadians = partialTurns * this.rotationRadians;
                if (this.rotateClockwise)
                    thetaRadians *= -1;

                // Rotate our camera pivot object
                this.vesselPivot.rotateY(thetaRadians);

            }

        }

    }

    private onCounterClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerClockwise) {
            this.triggerClockwise--;
        } else {
            if (!this.triggerCounterClockwise) {
                this.triggerCounterClockwise = 0;
            }
            this.triggerCounterClockwise++;
        }
    }

    private onClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerCounterClockwise) {
            this.triggerCounterClockwise--;
        } else {
            if (!this.triggerClockwise) {
                this.triggerClockwise = 0;
            }
            this.triggerClockwise++;
        }
    }

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        console.log(event.game);
    }

}