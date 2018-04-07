import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';

const QUARTER_TURN_RADIANS = (Math.PI / 2);

export class CameraComponent extends ComponentBase {

    private readonly cameraPivot: THREE.Object3D;
    private readonly cameraV3: THREE.Vector3;
    private readonly quarterTurnsPerSecond: number;
    
    private orbitClockwise?: boolean;
    private orbitClock?: THREE.Clock;
    private orbitTo?: THREE.Object3D;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.cameraPivot = new THREE.Object3D();
        this.quarterTurnsPerSecond = 5;
        this.cameraV3 = new THREE.Vector3();
        this.updateCamera(5, 3);
    }

    public updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this.cameraV3.set(0, newOrbitHeight, newOrbitRadius);
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Set initial camera position on first render using pivot object
        if (this.isFirstRender()) {
            this.cameraPivot.position.copy(renderingContext.scene.position.clone());
            this.cameraPivot.add(renderingContext.camera);
            renderingContext.scene.add(this.cameraPivot);
        }

        // Update camera properties
        if (!renderingContext.camera.position.equals(this.cameraV3)) {
            renderingContext.camera.position.copy(this.cameraV3);
            renderingContext.camera.lookAt(renderingContext.camera.parent.position);
        }

        // Get input
        let enterIsDown = renderingContext.keyboard.enterIsDown();
        let shiftIsDown = renderingContext.keyboard.shiftIsDown();

        // Determine if we are mid-orbit 
        let inOrbit = !!this.orbitTo && !!this.orbitClock;

        // Get time since last orbit adjustment (if applicable)
        let orbitDelta = 0;
        if (inOrbit) {
            orbitDelta = (this.orbitClock as THREE.Clock).getDelta();
        }

        // Check if we need to trigger a new orbit
        let triggerNewOrbit = enterIsDown && !inOrbit;
        if (triggerNewOrbit) {
            this.orbitClockwise = !shiftIsDown;
            let thetaRadians = QUARTER_TURN_RADIANS;
            if (!this.orbitClockwise) // pivot direction needs to be opposite of perspective rotation
                thetaRadians *= -1;
            this.orbitClock = new THREE.Clock();
            this.orbitTo = this.cameraPivot.clone().rotateY(thetaRadians);
        }

        // If we need to adjust for seconds elapsed while in orbit state
        if (orbitDelta > 0) {

            // Check if we have reached the end of the orbit / quarter turn animation
            let totalOrbitDelta = (this.orbitClock as THREE.Clock).getElapsedTime();
            if (totalOrbitDelta >= (1 / this.quarterTurnsPerSecond)) {

                // Move directly to final orientation
                this.cameraPivot.rotation.setFromVector3(
                    (this.orbitTo as THREE.Object3D).rotation.toVector3()
                );

                // finished rotating
                this.orbitClockwise = undefined;
                this.orbitClock = undefined;
                this.orbitTo = undefined;

            } else {

                // Calculate how much of a quarter turn we need to rotate by
                let quarterTurns = this.quarterTurnsPerSecond * orbitDelta;

                // Convert quarter turns to radians
                let thetaRadians = quarterTurns * QUARTER_TURN_RADIANS;
                if (!this.orbitClockwise)
                    thetaRadians *= -1;

                // Rotate our camera pivot object
                this.cameraPivot.rotateY(thetaRadians);

            }

        }

    }

}