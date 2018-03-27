export interface BufferAttributeInstruction {
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number;
}
export declare abstract class ProgramBase {
    readonly gl: WebGLRenderingContext;
    vs: WebGLShader;
    fs: WebGLShader;
    program: WebGLProgram;
    constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string);
    protected getAttribute(attribute: string): number;
    protected getUniform(uniform: string): WebGLUniformLocation;
    clearAndResize(): void;
    protected resizeViewportWithCanvas(): void;
    protected clearCanvasTransparent(): void;
    protected useCurrentProgram(): void;
    protected useNewCurrentBuffer(): WebGLBuffer;
    protected assignBufferToAttribute(buffer: WebGLBuffer, attribute: number, instruction: BufferAttributeInstruction): void;
    protected assign2fToUniform(uniform: WebGLUniformLocation, f1: number, f2: number): void;
    protected assign4fToUniform(uniform: WebGLUniformLocation, f1: number, f2: number, f3: number, f4: number): void;
    protected assignMat3fToUniform(uniform: WebGLUniformLocation, matrix: number[]): void;
    protected drawArrays(mode: number, offset: number, count: number): void;
}
