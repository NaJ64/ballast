import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';
import { PerspectiveTracker } from '../input/perspective-tracker';

@injectable()
export class GameComponent extends ComponentBase {

    private readonly perspectiveTracker: PerspectiveTracker;
    private cameraRotateTo?: THREE.Vector3;
    private inverted?: boolean;
    
    private cubeGeometry!: THREE.BoxGeometry;
    private cubeMaterial!: THREE.MeshBasicMaterial;
    private cube!: THREE.Mesh;

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
        // Create cube
        this.cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xaaaaaa } );
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial );
        // Create plane
        this.planeGeometry = new THREE.PlaneGeometry( 6, 6 );
        this.planeMaterial = new THREE.MeshBasicMaterial( { color: 0x000099, side: THREE.FrontSide } );
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = Math.PI / -2; // Lay plane flat along X and Z axis
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Add the cube and plane into the scene an setup the camera (only on initial render)
        if (this.isFirstRender()) {
            renderingContext.scene.add(this.cube);
            renderingContext.scene.add(this.plane)
        }

        // Flags for movement
        let forward = false;
        let back = false;
        let left = false;
        let right = false;

        // Check if we need to update cube position (according to user arrow key input)
        if (renderingContext.keyboard.upArrowIsDown() || renderingContext.keyboard.wIsDown())
            forward = true;
        if (renderingContext.keyboard.downArrowIsDown() || renderingContext.keyboard.sIsDown())
            back = true;
        if (renderingContext.keyboard.leftArrowIsDown() || renderingContext.keyboard.aIsDown())
            left = true;
        if (renderingContext.keyboard.rightArrowIsDown() || renderingContext.keyboard.dIsDown())
            right = true;
        
        // TODO: This needs to be updated to trigger a movemement to an adjacent tile based on relative direction
        //       Relative direction can be retrieved from the perspective tracker using "getRotation()" (for a rotationMatrix4)
        //       Or from the rendering context by using 
        
        if (forward || back) {
            let increment = 0.1;
            let movement = new THREE.Vector3(0, 0, 0);
            if (forward)
                movement.add(this.perspectiveTracker.getForwardScaled(increment));
            if (back)
                movement.add(this.perspectiveTracker.getBackScaled(increment));
            console.log(movement);
            this.cube.position.add(movement);
            renderingContext.cameraPivot.position.add(movement);
        }

        // Cube animates every frame/render
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}