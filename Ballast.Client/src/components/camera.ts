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

@injectable()
export class CameraComponent extends ComponentBase {

    // Current game / state
    private readonly gameStateChangedHandler: (event: GameStateChangedEvent) => Promise<void>;
    private currentGame?: Game;

    // Camera object(s)
    private readonly cameraPosition: THREE.Vector3;

    // Orbit flags/triggers 
    private readonly orbitTarget: THREE.Object3D;
    private readonly orbitAnimationDuration: number;
    private orbitRadians: number;
    private orbitClock?: THREE.Clock;
    private orbitClockwise?: boolean;
    private triggerClockwiseOrbit?: number;
    private triggerCounterClockwiseOrbit?: number;
    private orbitDirections: number;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker) {

        // Base constructor
        super(viewport, eventBus, perspectiveTracker);

        // Setup camera orientation/position
        this.cameraPosition = this.createCameraPosition();

        // Trigger(s) & properties for camera orbit animation
        this.orbitTarget = this.createOrbitTarget();
        this.orbitAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this.orbitRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this.orbitDirections = 8; // Default to 8 directions

        // Game state update listener
        this.gameStateChangedHandler = this.onGameStateChangedAsync.bind(this);

    }

    private createOrbitTarget() {
        let cameraPivotTarget = new THREE.Object3D();
        cameraPivotTarget.rotation.reorder('YXZ');
        return cameraPivotTarget;
    }

    private createCameraPosition() {
        return new THREE.Vector3();
    }

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Subscribe to all events
        this.subscribeToEvents();
        
    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {

        // Unsubscribe from all events
        this.unsubscribeFromEvents();

    }

    private subscribeToEvents() {
        this.eventBus.subscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
    }

    private unsubscribeFromEvents() {
        this.eventBus.unsubscribe(GameStateChangedEvent.id, this.gameStateChangedHandler);
    }

    private onCounterClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerClockwiseOrbit) {
            this.triggerClockwiseOrbit--;
        } else {
            if (!this.triggerCounterClockwiseOrbit) {
                this.triggerCounterClockwiseOrbit = 0;
            }
            this.triggerCounterClockwiseOrbit++;
        }
    }

    private onClockwiseClick(ev: MouseEvent) {
        if (!!this.triggerCounterClockwiseOrbit) {
            this.triggerCounterClockwiseOrbit--;
        } else {
            if (!this.triggerClockwiseOrbit) {
                this.triggerClockwiseOrbit = 0;
            }
            this.triggerClockwiseOrbit++;
        }
    }

    public updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this.cameraPosition.set(0, newOrbitHeight, newOrbitRadius);
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Reset objects if we have a new game
        let isNewGame = (renderingContext.game && (!this.currentGame || this.currentGame.id != renderingContext.game.id)) || false;
        if (isNewGame) {
            this.resetCamera(renderingContext);
        }

        // Get input
        let leftIsDown = renderingContext.keyboard.leftArrowIsDown();
        let rightIsDown = renderingContext.keyboard.rightArrowIsDown();
        let aIsDown = renderingContext.keyboard.aIsDown();
        let dIsDown = renderingContext.keyboard.dIsDown();

        // Use arrows or WASD or buttons
        let left = false; // leftIsDown || aIsDown || !!this.triggerCounterClockwise;
        let right = false;  // rightIsDown || dIsDown || !!this.triggerClockwise;
        this.applyOrbit(renderingContext, left, right);

    }

    private resetCamera(renderingContext: RenderingContext) {

        // Store info from new game state
        this.currentGame = <Game>renderingContext.game;
        this.orbitDirections = this.currentGame && this.currentGame.board.tileShape.possibleDirections || 8;
        if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 6) {
            this.orbitDirections = RenderingConstants.SIXTH_TURN_RADIANS;
        } else if (this.currentGame && this.currentGame.board.tileShape.possibleDirections == 4) {
            this.orbitDirections = RenderingConstants.QUARTER_TURN_RADIANS;
        } else {
            this.orbitDirections = RenderingConstants.EIGHTH_TURN_RADIANS;
        }

        // Update camera pivot orientation
        renderingContext.cameraPivot.rotation.set(0, 0, 0);
        this.orbitTarget.rotation.set(0, 0, 0);
        
        // Update camera properties
        this.updateCamera(10, 5); // TODO:  Update these coordinates to come from a default (same as constructor)
        if (!renderingContext.camera.position.equals(this.cameraPosition)) {
            renderingContext.camera.position.copy(this.cameraPosition);
            renderingContext.camera.lookAt(renderingContext.camera.parent.position);
        }

    }

    private applyOrbit(renderingContext: RenderingContext, left: boolean, right: boolean) {
        
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
            let thetaRadians = this.orbitRadians;
            if (!this.orbitClockwise) // pivot direction needs to be opposite of perspective rotation
                thetaRadians *= -1;
            this.orbitClock = new THREE.Clock();
            this.orbitTarget.rotateY(thetaRadians);
            if (!!this.triggerClockwiseOrbit && !this.orbitClockwise) {
                this.triggerClockwiseOrbit--;
            }
            if (!!this.triggerCounterClockwiseOrbit && this.orbitClockwise) {
                this.triggerCounterClockwiseOrbit--;
            }
        }

        // If we need to adjust for seconds elapsed while in orbit state
        if (orbitDelta > 0) {

            // Check if we have reached the end of the orbit / quarter turn animation
            let totalOrbitDelta = (this.orbitClock as THREE.Clock).getElapsedTime();
            if (totalOrbitDelta >= (this.orbitAnimationDuration)) {

                // Move directly to final orientation
                renderingContext.cameraPivot.rotation.setFromVector3(
                    (<THREE.Object3D>this.orbitTarget).rotation.toVector3()
                );

                // finished rotating
                this.orbitClockwise = undefined;
                this.orbitClock = undefined;
                
            } else {

                // Calculate how much of a partial turn we need to rotate by
                let partialTurns = (1 / this.orbitAnimationDuration) * orbitDelta;

                // Convert partial turns to radians
                let thetaRadians = partialTurns * this.orbitRadians;
                if (!this.orbitClockwise)
                    thetaRadians *= -1;

                // Rotate our camera pivot object
                renderingContext.cameraPivot.rotateY(thetaRadians);

            }

        }

    }

    private async onGameStateChangedAsync(event: GameStateChangedEvent): Promise<void> {
        // Do something here
    }

}