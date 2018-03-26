import { ProgramFactoryBase } from '../util';

const vs: string = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

const fs: string = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1);
    }
`;

export class TestProgramFactory extends ProgramFactoryBase {
    public constructor(gl: WebGLRenderingContext) {
        super(gl, vs, fs);
    }
}