import { createShader, createProgram } from '.'

export abstract class ProgramFactoryBase {

    public readonly gl: WebGLRenderingContext;
    public vs: WebGLShader;
    public fs: WebGLShader;

    public constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        this.gl = gl;
        this.vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    }

    public CreateProgram(): WebGLProgram {
        return createProgram(this.gl, this.vs, this.fs);
    }

}