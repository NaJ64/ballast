import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';

@injectable()
export class GameComponent extends ComponentBase {

    private cubeGeometry!: THREE.BoxGeometry;
    private cubeMaterial!: THREE.MeshBasicMaterial;
    private cube!: THREE.Mesh;

    private planeGeometry!: THREE.PlaneGeometry;
    private planeMaterial!: THREE.MeshBasicMaterial;
    private plane!: THREE.Mesh;

    private cameraRotateTo?: THREE.Vector3;
    private inverted?: boolean;
    
    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        // Create cube
        this.cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000cc } );
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial );
        // Create plane
        this.planeGeometry = new THREE.PlaneGeometry( 4, 4, 32 );
        this.planeMaterial = new THREE.MeshBasicMaterial( { color: 0xaaaaaa, side: THREE.DoubleSide } );
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = Math.PI / 2; // Lay plane flat along X and Z axis
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Add the cube and plane into the scene an setup the camera (only on initial render)
        if (this.isFirstRender()) {
            renderingContext.scene.add(this.cube);
            renderingContext.scene.add(this.plane)
        }

        // Check if we need to update cube position (according to user arrow key input)
        if (renderingContext.keyboard.leftArrowIsDown())
            this.cube.position.x -= 0.1;
        if (renderingContext.keyboard.rightArrowIsDown())
            this.cube.position.x += 0.1;
        if (renderingContext.keyboard.downArrowIsDown())
            this.cube.position.z += 0.1;
        if (renderingContext.keyboard.upArrowIsDown())
            this.cube.position.z -= 0.1;

        // Cube animates every frame/render
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}