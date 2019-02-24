import * as THREE from "three";
import * as THREE_EXT from '../../three-js/water-material';
import { RenderingComponentBase } from "../rendering-component";
import { IRenderingContext } from "../rendering-context";

export class WorldComponent extends RenderingComponentBase {
    
    private readonly _directionalLight: THREE.DirectionalLight;
    private readonly _skybox: THREE.Mesh;
    private readonly _waterTexture: THREE.Texture;
    private readonly _waterGeometry: THREE.PlaneBufferGeometry;
    private _water?: THREE_EXT.Water;
    private _waterMesh?: THREE.Mesh;
    
    public constructor() {
        super();
        this._directionalLight = this.createDirectionalLight();
        this._skybox = this.createSkybox();
        this._waterTexture = this.createWaterTexture();
        this._waterGeometry = this.createWaterGeometry();
    }

    private createSkybox(): THREE.Mesh {

        let cubeTextureLoader = new THREE.CubeTextureLoader();
        let cubeMap = cubeTextureLoader.load([
            'assets/images/skybox/px.jpg',
            'assets/images/skybox/nx.jpg',
            'assets/images/skybox/py.jpg',
            'assets/images/skybox/ny.jpg',
            'assets/images/skybox/pz.jpg',
            'assets/images/skybox/nz.jpg'
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

    private createDirectionalLight(): THREE.DirectionalLight {
        let directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(-600, 300, 600);
        return directionalLight;
    }

    private createWaterTexture(): THREE.Texture {
        let waterTextureLoader = new THREE.TextureLoader();
        let waterNormals = waterTextureLoader.load('assets/images/water/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        return waterNormals;
    }

    private createWaterGeometry(): THREE.PlaneBufferGeometry {
        let width = 100;
        let height = 100;
        let meshMirrorGeometry = new THREE.PlaneBufferGeometry(width * 500, height * 500, 10, 10);
        return meshMirrorGeometry;
    }

    private createWater(
        directionalLight: THREE.DirectionalLight, 
        waterTexture: THREE.Texture,
        waterGeometry: THREE.PlaneBufferGeometry,
        renderer: THREE.Renderer,
        camera: THREE.Camera,
        scene: THREE.Scene
    ): [THREE_EXT.Water, THREE.Mesh] {
        
        // Load water texture
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
            water.material
        );
        meshMirror.add(water);
        meshMirror.rotation.x = (Math.PI * -0.5);
        meshMirror.position.add(new THREE.Vector3(0,-0.5,0));

        return [water, meshMirror];

    }

    public onFirstRender(renderingContext: IRenderingContext) {

        // Create the water object/mesh using the renderer
        let water = this.createWater(
            this._directionalLight, 
            this._waterTexture, 
            this._waterGeometry,
            renderingContext.threeRenderer,
            renderingContext.threeCamera,
            renderingContext.threeScene
        );
        this._water = water["0"];
        this._waterMesh = water["1"];

        // Add skybox into the scene
        renderingContext.threeScene.add(this._skybox);
        
        // Add the lighting into the scene
        renderingContext.threeScene.add(this._directionalLight);

        // Add the water into the scene
        renderingContext.threeScene.add(this._waterMesh);

        // Proceed with normal render
        this.onRender(renderingContext);

    }

    public onRender(renderingContext: IRenderingContext) {
        
        // Animate/render water for the current frame
        if (this._water) {
            this._water!.material.uniforms.time.value += (1.0 / 60.0);
            this._water!.render();
        }
        
    }

}

