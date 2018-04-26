import * as THREE from 'three';

declare module 'three' {

    export let ShaderLib: {
        [name: string]: THREE.Shader;
        water: THREE.Shader;
    }

}