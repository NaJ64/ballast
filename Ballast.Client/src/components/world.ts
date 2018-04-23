import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';

@injectable()
export class WorldComponent extends ComponentBase {

    private directionalLight!: THREE.DirectionalLight;
    private skybox!: THREE.Mesh;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus
    ) {
        super(viewport, eventBus);
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        this.directionalLight = this.createDirectionalLight();
        //this.water = this.createWater(this.directionalLight);
        this.skybox = this.createSkybox();
    }

    private createDirectionalLight() {
        let directionalLight = new THREE.DirectionalLight(0xffff55, 1);
        directionalLight.position.set(-600, 300, 600);
        return directionalLight;
    }

    // private createWater(directionalLight: THREE.DirectionalLight) {

    //     // Params needed for the water reflection
    //     let renderer: THREE.Renderer;
    //     let camera: THREE.Camera;
    //     let scene: THREE.Scene;

    //     // Dimensions for the ocean
    //     let height = 2000;
    //     let width = 2000;

    //     // Load textures		
    //     var waterTextureLoader = new THREE.TextureLoader();
    //     var waterNormals = waterTextureLoader.load('waternormals.jpg'); //new THREE.ImageUtils.loadTexture('waternormals.jpg');
    //     waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

    //     // Create the water effect
	// 	let water = new THREE.Water(renderer, camera, scene, {
	// 		textureWidth: 512, 
	// 		textureHeight: 512,
	// 		waterNormals: waterNormals,
	// 		alpha: 	1.0,
	// 		sunDirection: directionalLight.position.normalize(),
	// 		sunColor: 0xffffff,
	// 		waterColor: 0x001e0f,
	// 		distortionScale: 50.0
    //     });
        
    //     var meshMirrorGeometry = new THREE.PlaneBufferGeometry(width * 500, height * 500, 10, 10);
	// 	var meshMirror = new THREE.Mesh(
	// 		meshMirrorGeometry, 
	// 		water.material
	// 	);
	// 	meshMirror.add(water);
    //     meshMirror.rotation.x = (Math.PI * -0.5);
        
    //     return meshMirror;

    // }

    private createSkybox() {

        let cubeTextureLoader = new THREE.CubeTextureLoader();
        let cubeMap = cubeTextureLoader.load([ //THREE.ImageUtils.loadTextureCube([
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg'
        ]);
        cubeMap.format = THREE.RGBFormat;

        let cubeShader = THREE.ShaderLib['cube'];
        cubeShader.uniforms['tCube'].value = cubeMap;

        let skyBoxGeometry = new THREE.BoxGeometry(1000000, 1000000, 1000000);

        let skyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        return new THREE.Mesh(
            skyBoxGeometry,
            skyBoxMaterial
        );

    }


    protected render(parent: HTMLElement, renderingContext: RenderingContext) {
        if (this.isFirstRender()) {
            renderingContext.scene.add(this.directionalLight);
            renderingContext.scene.add(this.skybox);
        }
    }

    public onAttach(parent: HTMLElement) {

    }

    protected onDetach(parent: HTMLElement) {

    }

}
