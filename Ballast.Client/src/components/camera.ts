import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from '../rendering/rendering-constants';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';

export class CameraComponent extends ComponentBase {

    private readonly cameraV3: THREE.Vector3;
    private readonly partialTurnsPerSecond: number;
    private partialTurnRadians: number;
    private orbitClockwise?: boolean;
    private orbitClock?: THREE.Clock;
    private orbitTo: THREE.Object3D;
    private resetCamera?: boolean;
    private gameStateChangedHandler?: (event: GameStateChangedEvent) => Promise<void>;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.orbitTo = new THREE.Object3D();
        this.orbitTo.rotation.reorder('YXZ');
        this.partialTurnRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
        this.partialTurnsPerSecond = RenderingConstants.PIVOT_DURATION_SECONDS;
        this.cameraV3 = new THREE.Vector3();
        this.updateCamera(10, 5);
        this.subscribeToEvents();
        this.resetCamera = true;
    }

    public updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this.cameraV3.set(0, newOrbitHeight, newOrbitRadius);
    }

    private subscribeToEvents() {
        this.gameStateChangedHandler = this.onGameStateChanged.bind(this);
        if (this.gameStateChangedHandler) {
            this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        }
    }

    private unsubscribeFromEvents() {
        if (this.gameStateChangedHandler) {
            this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
        }
    }

    private async onGameStateChanged(event: GameStateChangedEvent): Promise<void> {
        if (event.game && event.game.board.tileShape.applyHexRowScaling) {
            this.partialTurnRadians = RenderingConstants.SIXTH_TURN_RADIANS;
        } else if (event.game && !event.game.board.tileShape.hasDirectionNorthWest){
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

        // Use arrows or WASD
        let left = leftIsDown || aIsDown;
        let right = rightIsDown || dIsDown;

        // Determine if we are mid-orbit 
        let inOrbit = !!this.orbitClock;

        // Get time since last orbit adjustment (if applicable)
        let orbitDelta = 0;
        if (inOrbit) {
            orbitDelta = (this.orbitClock as THREE.Clock).getDelta();
        }

        // Check if we need to trigger a new orbit
        let triggerNewOrbit = (left && !right || right && !left) && !inOrbit;
        if (triggerNewOrbit) {
            this.orbitClockwise = left; // Reverse direction
            let thetaRadians = this.partialTurnRadians;
            if (!this.orbitClockwise) // pivot direction needs to be opposite of perspective rotation
                thetaRadians *= -1;
            this.orbitClock = new THREE.Clock();
            this.orbitTo.rotateY(thetaRadians);
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

    public dispose(): void { 
        this.unsubscribeFromEvents();
    }

}