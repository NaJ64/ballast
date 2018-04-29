import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { Game } from 'ballast-core';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from '../rendering/rendering-constants';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { GameStateChangedEvent } from '../messaging/events/game/game-state-changed';
import { PerspectiveTracker } from '../input/perspective-tracker';

export class CameraComponent extends ComponentBase {

    private readonly gameStateChangedHandler: (event: GameStateChangedEvent) => Promise<void>;
    private readonly partialTurnsPerSecond: number;
    private readonly cameraV3: THREE.Vector3;
    private readonly orbitTo: THREE.Object3D;
    private currentGame?: Game;
    private triggerClockwise: number;
    private triggerCounterClockwise: number;
    private partialTurnRadians: number;
    private orbitClockwise?: boolean;
    private orbitClock?: THREE.Clock;
    private resetCamera?: boolean;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker) {

        super(viewport, eventBus, perspectiveTracker);
        this.orbitTo = new THREE.Object3D();
        this.orbitTo.rotation.reorder('YXZ');
        this.partialTurnRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this.partialTurnsPerSecond = 1 / RenderingConstants.PIVOT_DURATION_SECONDS;
        this.cameraV3 = new THREE.Vector3();
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);
        this.resetCamera = true;
        this.triggerClockwise = 0;
        this.triggerCounterClockwise = 0;
        this.updateCamera(10, 5);

    }

    protected onAttach(parent: HTMLElement) {
        this.subscribeToEvents();
    }

    public dispose(): void { 
        this.unsubscribeFromEvents();
    }

    protected onDetach() {
        this.unsubscribeFromEvents();
    }

    private subscribeToEvents() {
        this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
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

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // If the camera reset flag has been set, re-orient camera back to start
        if (this.resetCamera) {
            let initialY = 0;
            this.orbitTo.rotation.set(0, 0, 0);
            renderingContext.cameraPivot.rotation.set(0, 0, 0);
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
        let left = false; // leftIsDown || aIsDown || !!this.triggerCounterClockwise;
        let right = false;  // rightIsDown || dIsDown || !!this.triggerClockwise;

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

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        let newGame = (!!event.game && (!this.currentGame || this.currentGame.id != event.game.id));
        if (newGame) {
            this.currentGame = event.game;
            if (event.game && event.game.board.tileShape.possibleDirections == 6) {
                this.partialTurnRadians = RenderingConstants.SIXTH_TURN_RADIANS;
            } else if (event.game && event.game.board.tileShape.possibleDirections == 4){
                this.partialTurnRadians = RenderingConstants.QUARTER_TURN_RADIANS;
            } else {
                this.partialTurnRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
            }
            this.resetCamera = true;
        }
    }

}