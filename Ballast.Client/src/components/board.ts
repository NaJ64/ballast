import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';
import { PerspectiveTracker } from '../input/perspective-tracker';

@injectable()
export class BoardComponent extends ComponentBase {

    private readonly perspectiveTracker: PerspectiveTracker;
    private cameraRotateTo?: THREE.Vector3;
    private inverted?: boolean;
    
    private planeGeometry!: THREE.PlaneGeometry;
    private planeMaterial!: THREE.MeshBasicMaterial;
    private plane!: THREE.Mesh;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker
    ) {
        super(viewport, eventBus);
        this.perspectiveTracker = perspectiveTracker;
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        // Create plane
        this.planeGeometry = new THREE.PlaneGeometry( 6, 6 );
        this.planeMaterial = new THREE.MeshBasicMaterial( { color: 0x000099, side: THREE.FrontSide } );
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = Math.PI / -2; // Lay plane flat along X and Z axis
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {
        // Add the cube and plane into the scene an setup the camera (only on initial render)
        if (this.isFirstRender()) {
            renderingContext.scene.add(this.plane)
        }
    }

}