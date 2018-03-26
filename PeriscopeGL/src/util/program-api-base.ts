import { createShader, createProgram, resizeCanvas } from '.'

export interface BufferAttributeInstruction {
    // Tells an attribute how to get data out of current buffer
    size: number;           // 2 components per iteration
    type: number;           // the data is 32bit floats
    normalize: boolean;     // don't normalize the data
    stride: number;         // 0 = move forward size * sizeof(type) each iteration to get the next position
    offset: number;         // start at the beginning of the buffer
}

export abstract class ProgramApiBase {

    public readonly gl: WebGLRenderingContext;
    public vs: WebGLShader;
    public fs: WebGLShader;
    public program: WebGLProgram;

    public constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        this.gl = gl;
        this.vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        this.program = createProgram(this.gl, this.vs, this.fs);
    }

    protected getAttribute(attribute: string) : number {
        return this.gl.getAttribLocation(this.program, attribute);
    }

    protected resizeViewportWithCanvas() {
        resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    protected clearCanvasTransparent() {
        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    protected useCurrentProgram() {        
        this.gl.useProgram(this.program);
    }

    protected useNewCurrentBuffer(): WebGLBuffer {
        // create a new buffer
        var buffer = this.gl.createBuffer();
        if (!buffer)
            throw new Error('Could not create position buffer');
        // Bind so all other gl functions refer to the new buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        return buffer;
    }

    protected setBufferForAttribute(buffer: WebGLBuffer, attribute: number, instruction: BufferAttributeInstruction) {
        // activate the attribute
        this.gl.enableVertexAttribArray(attribute);  
        // // Bind the position buffer
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        // Instructions on how to 
        var size = instruction.size;          // 2 components per iteration
        var type = instruction.type;   // the data is 32bit floats
        var normalize = instruction.normalize; // don't normalize the data
        var stride = instruction.stride;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = instruction.offset;        // start at the beginning of the buffer
        // Bind the attribute to the current buffer
        this.gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset)
    }

    protected drawArrays(mode: number, offset: number, count: number) {
        this.gl.drawArrays(mode, offset, count);
    }

}