import * as THREE from 'three';
import * as THREE_ext from '../extensions/water-material';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';

@injectable()
export class WorldComponent extends ComponentBase {

    private directionalLight!: THREE.DirectionalLight;
    private water!: THREE_ext.Water;
    private waterMesh!: THREE.Mesh;
    private waterTexture!: THREE.Texture;
    private waterGeometry!: THREE.PlaneBufferGeometry;
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
        this.waterTexture = this.createWaterTexture();
        this.waterGeometry = this.createWaterGeometry();
        this.skybox = this.createSkybox();
    }

    private createDirectionalLight() {
        let directionalLight = new THREE.DirectionalLight(0xffff55, 1);
        directionalLight.position.set(-600, 300, 600);
        return directionalLight;
    }

    private createPlaceholderWater(directionalLight: THREE.DirectionalLight) {
        // Dimensions for the ocean
        let height = 256;
        let width = 256;
        let waterGeometry = new THREE.PlaneBufferGeometry(width * 500, height * 500, 10, 10);
        let waterMaterial = new THREE.MeshBasicMaterial({ color: 0x000033, side: THREE.FrontSide });
		let waterMesh = new THREE.Mesh(
			waterGeometry, 
			waterMaterial
        );
        waterMesh.rotation.x = (Math.PI * -0.5);
        waterMesh.position.add(new THREE.Vector3(0,-0.5,0));
        return waterMesh;
    }

    private createWaterTexture() {
        // Load texture	
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

    private createWaterMesh(
        renderer: THREE.Renderer,
        camera: THREE.Camera,
        scene: THREE.Scene,
        directionalLight: THREE.DirectionalLight
    ) {

        // Load texture	
        let waterNormals = this.waterTexture;
        let meshMirrorGeometry = this.waterGeometry;

        // Create the water effect
		let water = new THREE_ext.Water(renderer, camera, scene, {
			textureWidth: 512, 
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0
        });
        this.water = water;

        //let testMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.FrontSide });
        
		let meshMirror = new THREE.Mesh(
			meshMirrorGeometry, 
			water.material // testMaterial
		);
		meshMirror.add(water);
        meshMirror.rotation.x = (Math.PI * -0.5);
        meshMirror.position.add(new THREE.Vector3(0,-0.5,0));
        
        return meshMirror;

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

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        if (this.isFirstRender()) {

            this.waterMesh = this.createWaterMesh(
                renderingContext.renderer,
                renderingContext.camera,
                renderingContext.scene,
                this.directionalLight
            );

            renderingContext.scene.add(this.waterMesh);
            renderingContext.scene.add(this.directionalLight);
            renderingContext.scene.add(this.skybox);
            
        }
        
        this.water.material.uniforms.time.value += 1.0 / 60.0;
		this.water.render();

    }

    public onAttach(parent: HTMLElement) {

    }

    protected onDetach(parent: HTMLElement) {

    }

}
