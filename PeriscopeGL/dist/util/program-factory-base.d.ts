export declare abstract class ProgramFactoryBase {
    readonly gl: WebGLRenderingContext;
    vs: WebGLShader;
    fs: WebGLShader;
    constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string);
    CreateProgram(): WebGLProgram;
}
