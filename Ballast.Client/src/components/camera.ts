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
    private readonly orbitRadius: number;
    private readonly orbitHeight: number;
    private readonly quarterTurnsPerSecond: number;
    
    private inOrbit: boolean;
    private clockwise: boolean;
    private orbitTo?: THREE.Vector3;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);

        this.cameraPivot = new THREE.Object3D();
        this.orbitRadius = 5;
        this.orbitHeight = 2;
        this.quarterTurnsPerSecond = 2;
        this.inOrbit = false;
        this.clockwise = true;
        this.orbitTo = undefined;

    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Set initial camera position on first render using pivot object
        if (this.isFirstRender()) {
            this.cameraPivot.position.copy(renderingContext.scene.position.clone());
            this.cameraPivot.add(renderingContext.camera);
            renderingContext.camera.position.copy(new THREE.Vector3(0, this.orbitHeight, this.orbitRadius));
            renderingContext.camera.lookAt(renderingContext.camera.parent.position);
            renderingContext.scene.add(this.cameraPivot);
        }

        // Get input
        let enterIsDown = renderingContext.keyboard.enterIsDown();
        let shiftIsDown = renderingContext.keyboard.shiftIsDown();
        let triggerOrbit = enterIsDown;

        // Check if we need to trigger a new orbit
        if (!this.inOrbit && triggerOrbit) {
            this.clockwise = (triggerOrbit && !shiftIsDown);
            let thetaRadians = QUARTER_TURN_RADIANS;
            if (!this.clockwise) // pivot direction needs to be opposite of perspective rotation
                thetaRadians *= -1;
            this.orbitTo = this.cameraPivot.clone().rotateY(thetaRadians).rotation.toVector3();
            this.inOrbit = true;
            this.clock.getDelta(); // refresh timer
        }

        // If we are mid-orbit
        if (this.inOrbit && this.orbitTo) {

            // Get time delta since last render 
            let elapsedSeconds = this.clock.getDelta();

            // Calculate how much of a quarter turn we need to rotate by
            let quarterTurns = this.quarterTurnsPerSecond * elapsedSeconds;

            // Convert quarter turns to radians
            let thetaRadians = quarterTurns * QUARTER_TURN_RADIANS;
            if (!this.clockwise)
                thetaRadians *= -1;

            // Rotate our camera pivot object
            this.cameraPivot.rotateY(thetaRadians);

            // Compare the our current orientation to our desired orientation
            let finished = Math.round(this.orbitTo.distanceTo(this.cameraPivot.rotation.toVector3())) == 0;
            if (finished) {
                this.orbitTo = undefined;
                this.inOrbit = false;
            }

        }

    }

}