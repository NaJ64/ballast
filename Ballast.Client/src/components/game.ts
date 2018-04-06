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

    protected getComponentId() {
        return TYPES_BALLAST.GameComponent;
    }

    private isInitialRender: boolean;

    private cubeGeometry!: THREE.BoxGeometry;
    private cubeMaterial!: THREE.MeshBasicMaterial;
    private cube!: THREE.Mesh;

    private planeGeometry!: THREE.PlaneGeometry;
    private planeMaterial!: THREE.MeshBasicMaterial;
    private plane!: THREE.Mesh;

    private stepRotationM4!: THREE.Matrix4;
    private fullRotationM4!: THREE.Matrix4;

    private stepInverseRotationM4!: THREE.Matrix4;
    private fullInverseRotationM4!: THREE.Matrix4;
    
    private cameraRotateTo?: THREE.Vector3;
    private inverted?: boolean;
    
    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.isInitialRender = true;
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        // Define a camera rotation matrix
        this.stepRotationM4 = new THREE.Matrix4().makeRotationY(Math.PI / 20);
        this.stepInverseRotationM4 = new THREE.Matrix4().makeRotationY(Math.PI / -20);
        this.fullRotationM4 = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        this.fullInverseRotationM4 = new THREE.Matrix4().makeRotationY(Math.PI / -2);
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
        if (this.isInitialRender) {
            renderingContext.scene.add(this.cube);
            renderingContext.scene.add(this.plane)
            renderingContext.camera.position.z = 5;
            renderingContext.camera.position.y = 2;
            renderingContext.camera.lookAt(this.plane.position);
        }

        // Check if we have finished rotating to desired position
        let finishedRotating = this.cameraRotateTo 
            ? Math.round(renderingContext.camera.position.distanceTo(this.cameraRotateTo)) == 0 
            : true;

        // If we have not finished rotating to the new position...
        if (!finishedRotating && this.cameraRotateTo) {
            
            // Rotate some more (1/10th of a quarter-turn)
            renderingContext.camera.position
                .applyMatrix4(!this.inverted ? this.stepRotationM4 : this.stepInverseRotationM4);

            // Check if we made it to the destination position
            if (Math.round(renderingContext.camera.position.distanceTo(this.cameraRotateTo)) == 0) {
                // reset flag and get rid of position data
                finishedRotating = true;
                this.cameraRotateTo = undefined;
            }

            // Point camera back at the center of the scene / plane
            renderingContext.camera.lookAt(this.plane.position);

        }

        // Check if the enter key is being pressed
        if (finishedRotating && renderingContext.keyboard.enterIsDown()) {
            // Shift key indicates going backward (counter clockwise)
            this.inverted = renderingContext.keyboard.shiftIsDown();
            // Determine a new position for camera using rotation matrix
            let matrix = this.inverted ? this.fullInverseRotationM4 : this.fullRotationM4;
            // Trigger a rotation (on the next pass) by setting a new desired position
            this.cameraRotateTo = renderingContext.camera.position.clone()
                .applyMatrix4(matrix);
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

        // Reset flag so that subsequent renders to re-drawn existing assets
        if (this.isInitialRender)
            this.isInitialRender = false;

    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}