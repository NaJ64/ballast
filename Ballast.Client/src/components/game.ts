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

    private geometry?: THREE.BoxGeometry;
    private material?: THREE.MeshBasicMaterial;
    private cube?: THREE.Mesh;

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        if (!this.geometry) {
            this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        }
        if (!this.material) {
            this.material = new THREE.MeshBasicMaterial( { color: 0x0000cc } );
        }
        if (!this.cube) {
            this.cube = new THREE.Mesh(this.geometry,this.material );
        }

        // update rotation every time the object is rendered
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        
        if (renderingContext.threeScene) {
            renderingContext.threeScene.add(this.cube);
        }
        if (renderingContext.threePerspectiveCamera) {
            renderingContext.threePerspectiveCamera.position.z = 5;
        }

    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}