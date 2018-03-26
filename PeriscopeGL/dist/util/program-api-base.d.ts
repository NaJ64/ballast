export interface BufferAttributeInstruction {
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number;
}
export declare abstract class ProgramApiBase {
    readonly gl: WebGLRenderingContext;
    vs: WebGLShader;
    fs: WebGLShader;
    program: WebGLProgram;
    constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string);
    protected getAttribute(attribute: string): number;
    protected resizeViewportWithCanvas(): void;
    protected clearCanvasTransparent(): void;
    protected useCurrentProgram(): void;
    protected useNewCurrentBuffer(): WebGLBuffer;
    protected setBufferForAttribute(buffer: WebGLBuffer, attribute: number, instruction: BufferAttributeInstruction): void;
    protected drawArrays(mode: number, offset: number, count: number): void;
}
