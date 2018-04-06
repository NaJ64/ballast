import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { Vector3 } from 'three';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';

export class CameraComponent extends ComponentBase {

    private readonly origin: THREE.Vector3;
    private readonly orbitRadius: number;
    private readonly orbitHeight: number;
    private readonly quarterTurnFrames: number;
    private readonly clockwiseCurve: THREE.EllipseCurve; 
    private readonly clockwisePoints: THREE.Vector3[]; 
    private readonly counterClockwiseCurve:THREE.EllipseCurve; 
    private readonly counterClockwisePoints:THREE.Vector3[]; 
    private readonly firstRender: boolean;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);

        this.origin = new THREE.Vector3(0, 0, 0);
        this.orbitRadius = 5;
        this.orbitHeight = 2;
        this.quarterTurnFrames = 60; // 1 second to rotate 90 degrees if running at 60fps
        this.clockwiseCurve = this.createQuarterTurnEllipseCurve(true, 5);
        this.clockwisePoints = this.getCameraTrackPoints(this.clockwiseCurve, this.quarterTurnFrames);
        this.counterClockwiseCurve = this.createQuarterTurnEllipseCurve(false, 5);
        this.counterClockwisePoints = this.getCameraTrackPoints(this.counterClockwiseCurve, this.quarterTurnFrames);

        this.firstRender = true;

    }

    private createQuarterTurnEllipseCurve(clockwise: boolean, radius: number) {
        var startAngle = clockwise ? (Math.PI * 2) : (Math.PI * 1.5);
        var endAngle = clockwise ? 0 : (Math.PI / 2);
        return new THREE.EllipseCurve(
            0, 0,                       // ax, aY
            radius, radius,             // xRadius, yRadius
            startAngle, endAngle,       // aStartAngle, aEndAngle
            clockwise,                  // aClockwise
            0                           // aRotation (radians around X axis... 0 is flat)
        );
    }

    private getCameraTrackPoints(curve: THREE.EllipseCurve, points: number) {
        return curve.getPoints(points).map(p => new THREE.Vector3(p.x, this.orbitHeight, p.y));
    }

    protected getComponentId() {
        return TYPES_BALLAST.CameraComponent;
    }

    public render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Set camera to initial position if this is the first render of the component
        if (this.firstRender) {
            renderingContext.camera.position.z = this.orbitRadius;
            renderingContext.camera.position.y = this.orbitHeight;
            renderingContext.camera.lookAt(this.origin);
        }

    }

}