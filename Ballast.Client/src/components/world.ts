import * as THREE from 'three';
import * as THREE_EXT from '../extensions/water-material';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { PerspectiveTracker } from '../input/perspective-tracker';

@injectable()
export class WorldComponent extends ComponentBase {

    private directionalLight: THREE.DirectionalLight;
    private water: THREE_EXT.Water;
    private waterMesh: THREE.Mesh;
    private waterTexture: THREE.Texture;
    private waterGeometry: THREE.PlaneBufferGeometry;
    private skybox: THREE.Mesh;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker
    ) {
        super(viewport, eventBus, perspectiveTracker);
        this.skybox = this.createSkybox();
        this.directionalLight = this.createDirectionalLight();
        this.waterTexture = this.createWaterTexture();
        this.waterGeometry = this.createWaterGeometry();
        let water = this.createWater(this.directionalLight, this.waterTexture, this.waterGeometry);
        this.water = water["0"];
        this.waterMesh = water["1"];
    }

    private createSkybox() {

        let cubeTextureLoader = new THREE.CubeTextureLoader();
        let cubeMap = cubeTextureLoader.load([ //THREE.ImageUtils.loadTextureCube([
            'images/skybox/px.jpg',
            'images/skybox/nx.jpg',
            'images/skybox/py.jpg',
            'images/skybox/ny.jpg',
            'images/skybox/pz.jpg',
            'images/skybox/nz.jpg'
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

    private createDirectionalLight() {
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-600, 300, 600);
        return directionalLight;
    }

    private createWaterTexture() {
        let waterTextureLoader = new THREE.TextureLoader();
        let waterNormals = waterTextureLoader.load('images/water/waternormals.jpg'); //new THREE.ImageUtils.loadTexture('waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
        return waterNormals;
    }

    private createWaterGeometry() {
        let width = 100;
        let height = 100;
        let meshMirrorGeometry = new THREE.PlaneBufferGeometry(width * 500, height * 500, 10, 10);
        return meshMirrorGeometry;
    }

    private createWater(
        directionalLight: THREE.DirectionalLight, 
        waterTexture: THREE.Texture,
        waterGeometry: THREE.PlaneBufferGeometry): [THREE_EXT.Water, THREE.Mesh] {

        let renderingContext = this.viewport.getRenderingContext();
        let renderer = renderingContext.renderer;
        let camera = renderingContext.camera;
        let scene = renderingContext.scene;

        // Load texture	
        let waterNormals = waterTexture;
        let meshMirrorGeometry = waterGeometry;

        // Create the water effect
		let water = new THREE_EXT.Water(renderer, camera, scene, {
			textureWidth: 512, 
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0
        });
		let meshMirror = new THREE.Mesh(
			meshMirrorGeometry, 
			water.material // testMaterial
		);
		meshMirror.add(water);
        meshMirror.rotation.x = (Math.PI * -0.5);
        meshMirror.position.add(new THREE.Vector3(0,-0.5,0));
        
        return [ water, meshMirror ];

    }

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) { 
        
        // Add skybox into scene
        renderingContext.scene.add(this.skybox);

        // Add lighting into scene
        renderingContext.scene.add(this.directionalLight);

        // Add water into scene
        renderingContext.scene.add(this.waterMesh);
        
    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) { 

        // Add skybox into scene
        renderingContext.scene.remove(this.skybox);

        // Add lighting into scene
        renderingContext.scene.remove(this.directionalLight);
        
        // Add water into scene
        renderingContext.scene.remove(this.waterMesh);
        
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Refresh/render water for the current frame
        this.water.material.uniforms.time.value += (1.0 / 60.0);
		this.water.render();

    }

}
