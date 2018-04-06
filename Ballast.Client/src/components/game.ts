import * as THREE from 'three';
import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';

@injectable()
export class GameComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.GameComponent;
    }

    private cubeGeometry?: THREE.BoxGeometry;
    private planeGeometry?: THREE.PlaneGeometry;
    private cubeMaterial?: THREE.MeshBasicMaterial;
    private planeMaterial?: THREE.MeshBasicMaterial;
    private cube?: THREE.Mesh;
    private plane?: THREE.Mesh;
    private cameraRotate?: boolean;
    private cameraRotateTo: number = 0;

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        if (!this.cubeGeometry) {
            this.cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        }
        if (!this.planeGeometry) {
            this.planeGeometry = new THREE.PlaneGeometry( 4, 4, 32 );
        }        
        if (!this.cubeMaterial) {
            this.cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000cc } );
        }
        if (!this.planeMaterial) {
            this.planeMaterial = new THREE.MeshBasicMaterial( { color: 0xaaaaaa, side: THREE.DoubleSide } );
        }        
        if (!this.cube) {
            this.cube = new THREE.Mesh(this.cubeGeometry,this.cubeMaterial );
        }
        if (!this.plane) {
            this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            this.plane.rotation.x = Math.PI / 2;
        }        
 
        if (renderingContext.keyboard.enterKeyIsDown() && !this.cameraRotate) {
            this.cameraRotate = true;

            //not what we want to do. The camera needs to rotate around an axis (the center of the grid). Here it rotates around its own center.
            this.cameraRotateTo = renderingContext.threePerspectiveCamera ? renderingContext.threePerspectiveCamera.rotation.y + Math.PI*2 : 0;
        }

        if(this.cameraRotate === true){
            if(renderingContext.threePerspectiveCamera){
                renderingContext.threePerspectiveCamera.rotation.y += .1;
                if(renderingContext.threePerspectiveCamera.rotation.y > this.cameraRotateTo)
                    this.cameraRotate = false;
            }
        }

        if (renderingContext.keyboard.leftArrowIsDown()) {
            this.cube.position.x -= 0.1;
        }
        if (renderingContext.keyboard.rightArrowIsDown()) {
            this.cube.position.x += 0.1;
        }
        if (renderingContext.keyboard.downArrowIsDown()) {
            this.cube.position.y -= 0.1;
        }
        if (renderingContext.keyboard.upArrowIsDown()) {
            this.cube.position.y += 0.1;
        }

        // update rotation every time the object is rendered
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        if (renderingContext.threeScene) {
            renderingContext.threeScene.add(this.cube);
            renderingContext.threeScene.add(this.plane)
        }
        if (renderingContext.threePerspectiveCamera) {
            renderingContext.threePerspectiveCamera.position.z = 5;
            renderingContext.threePerspectiveCamera.position.y = 2;
        }

    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}