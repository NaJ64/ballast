import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from '../rendering/rendering-constants';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';

export class CameraComponent extends ComponentBase {

    private readonly gameStateChangedHandler: (event: GameStateChangedEvent) => Promise<void>;
    private readonly counterClockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;
    private readonly clockwiseClickListener: (this: HTMLButtonElement, ev: MouseEvent) => any;
    private readonly partialTurnsPerSecond: number;
    private readonly cameraV3: THREE.Vector3;
    private readonly orbitTo: THREE.Object3D;
    private triggerClockwise: number;
    private triggerCounterClockwise: number;
    private clockwiseButton?: HTMLButtonElement;
    private counterClockwiseButton?: HTMLButtonElement;
    private partialTurnRadians: number;
    private orbitClockwise?: boolean;
    private orbitClock?: THREE.Clock;
    private resetCamera?: boolean;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.orbitTo = new THREE.Object3D();
        this.orbitTo.rotation.reorder('YXZ');
        this.partialTurnRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this.partialTurnsPerSecond = RenderingConstants.PIVOT_DURATION_SECONDS;
        this.cameraV3 = new THREE.Vector3();
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);
        this.counterClockwiseClickListener = this.onCounterClockwiseClick.bind(this);
        this.clockwiseClickListener = this.onClockwiseClick.bind(this);
        this.resetCamera = true;
        this.triggerClockwise = 0;
        this.triggerCounterClockwise = 0;
        this.updateCamera(10, 5);
    }

    protected onAttach(parent: HTMLElement) {
        let buttons = this.createRotationButtons(parent)
        this.counterClockwiseButton = buttons["0"];
        this.clockwiseButton = buttons["1"];
        this.subscribeToEvents();
    }

    public dispose(): void { 
        this.unsubscribeFromEvents();
    }

    protected onDetach() {
        this.unsubscribeFromEvents();
    }

    private createRotationButtons(container: HTMLElement): [HTMLButtonElement, HTMLButtonElement] {

        // Add some CSS to the game style header tag for media query'ing the buttons
        let style = this.viewport.getGameStyle();
        style.appendChild(style.ownerDocument.createTextNode(`
            .ballastButton { 
                transform: rotate(180deg);
                position: absolute;
                color: white;
                background-color: transparent;
                border-width: 0px;
                border-style: solid;
                border-color: rgba(255, 255, 255, 0.1);
                text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
                font-size: 5vw;
            } 
            @media screen and (min-width: 1000px) { 
                .ballastButton { 
                    font-size: 50px;
                } 
            }
        `));
        
        let counterClockwiseButton = container.ownerDocument.createElement('button');
        counterClockwiseButton.innerHTML = '&#8634';
        counterClockwiseButton.type = 'button';
        counterClockwiseButton.className = 'ballastButton';
        counterClockwiseButton.style.cssFloat = 'left';
        counterClockwiseButton.style.top = '10%';
        counterClockwiseButton.style.left = '5.63%';

        let clockwiseButton = container.ownerDocument.createElement('button');
        clockwiseButton.innerHTML = '&#8635';
        clockwiseButton.type = 'button';
        clockwiseButton.className = 'ballastButton';
        clockwiseButton.style.cssFloat = 'right';
        clockwiseButton.style.top = '10%';
        clockwiseButton.style.right = '5.63%';

        container.appendChild(counterClockwiseButton);
        container.appendChild(clockwiseButton);

        return [ counterClockwiseButton, clockwiseButton ];

    }

    private subscribeToEvents() {
        if (this.gameStateChangedHandler) {
            this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        }
        if (this.counterClockwiseButton) {
            this.counterClockwiseButton.addEventListener('click', this.counterClockwiseClickListener);
            //this.counterClockwiseButton.onclick = event => this.onCounterClockwiseClick();
        }
        if (this.clockwiseButton) {
            this.clockwiseButton.addEventListener('click', this.clockwiseClickListener);
            //this.clockwiseButton.onclick = event => this.onClockwiseClick();
        }
    }

    private unsubscribeFromEvents() {
        if (this.gameStateChangedHandler) {
            this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        }
        if (this.counterClockwiseButton) {
            this.counterClockwiseButton.removeEventListener('click', this.counterClockwiseClickListener);
            //this.counterClockwiseButton.onclick = null;
        }
        if (this.clockwiseButton) {
            this.clockwiseButton.removeEventListener('click', this.clockwiseClickListener);
            //this.clockwiseButton.onclick = null;
        }
    }

    private onCounterClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerClockwise) {
            this.triggerClockwise--;
        } else {
            this.triggerCounterClockwise++;
        }
    }

    private onClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerCounterClockwise) {
            this.triggerCounterClockwise--;
        } else {
            this.triggerClockwise++;
        }
    }

    public updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this.cameraV3.set(0, newOrbitHeight, newOrbitRadius);
    }

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        if (event.game && event.game.board.tileShape.possibleDirections == 6) {
            this.partialTurnRadians = RenderingConstants.SIXTH_TURN_RADIANS;
        } else if (event.game && event.game.board.tileShape.possibleDirections == 4){
            this.partialTurnRadians = RenderingConstants.QUARTER_TURN_RADIANS;
        } else {
            this.partialTurnRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
        }
        this.resetCamera = true;
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Set initial camera position on first render using pivot object
        if (this.isFirstRender()) {
            renderingContext.cameraPivot.rotation.reorder('YXZ');
        }

        // If the camera reset flag has been set, re-orient camera back to start
        if (this.resetCamera) {
            let initialY = Math.PI / -2;
            this.orbitTo.rotation.set(0, initialY, 0);
            renderingContext.cameraPivot.rotation.set(0, initialY, 0);
            this.resetCamera = false;
        }

        // Update camera properties
        if (!renderingContext.camera.position.equals(this.cameraV3)) {
            renderingContext.camera.position.copy(this.cameraV3);
            renderingContext.camera.lookAt(renderingContext.camera.parent.position);
        }

        // Get input
        let leftIsDown = renderingContext.keyboard.leftArrowIsDown();
        let rightIsDown = renderingContext.keyboard.rightArrowIsDown();
        let aIsDown = renderingContext.keyboard.aIsDown();
        let dIsDown = renderingContext.keyboard.dIsDown();

        // Use arrows or WASD or buttons
        let left = leftIsDown || aIsDown || !!this.triggerCounterClockwise;
        let right = rightIsDown || dIsDown || !!this.triggerClockwise;

        // Determine if we are mid-orbit 
        let inOrbit = !!this.orbitClock;

        // Get time since last orbit adjustment (if applicable)
        let orbitDelta = 0;
        if (inOrbit) {
            orbitDelta = (this.orbitClock as THREE.Clock).getDelta();
        }

        // Check if we need to trigger a new orbit
        let triggerNewOrbit = !inOrbit && (!right && left || !left && right);
        if (triggerNewOrbit) {
            this.orbitClockwise = left; // Reverse direction
            let thetaRadians = this.partialTurnRadians;
            if (!this.orbitClockwise) // pivot direction needs to be opposite of perspective rotation
                thetaRadians *= -1;
            this.orbitClock = new THREE.Clock();
            this.orbitTo.rotateY(thetaRadians);
            if (!!this.triggerClockwise && !this.orbitClockwise) {
                this.triggerClockwise--;
            }
            if (!!this.triggerCounterClockwise && this.orbitClockwise) {
                this.triggerCounterClockwise--;
            }
        }

        // If we need to adjust for seconds elapsed while in orbit state
        if (orbitDelta > 0) {

            // Check if we have reached the end of the orbit / quarter turn animation
            let totalOrbitDelta = (this.orbitClock as THREE.Clock).getElapsedTime();
            if (totalOrbitDelta >= (1 / this.partialTurnsPerSecond)) {

                // Move directly to final orientation
                renderingContext.cameraPivot.rotation.setFromVector3(
                    (<THREE.Object3D>this.orbitTo).rotation.toVector3()
                );

                // finished rotating
                this.orbitClockwise = undefined;
                this.orbitClock = undefined;
                
            } else {

                // Calculate how much of a partial turn we need to rotate by
                let partialTurns = this.partialTurnsPerSecond * orbitDelta;

                // Convert partial turns to radians
                let thetaRadians = partialTurns * this.partialTurnRadians;
                if (!this.orbitClockwise)
                    thetaRadians *= -1;

                // Rotate our camera pivot object
                renderingContext.cameraPivot.rotateY(thetaRadians);

            }

        }

    }

}