import { createShader, createProgram, resizeCanvas } from '../utilities';

export interface BufferAttributeInstruction {
    // Tells an attribute how to get data out of current buffer
    size: number;           // 2 components per iteration
    type: number;           // the data is 32bit floats
    normalize: boolean;     // don't normalize the data
    stride: number;         // 0 = move forward size * sizeof(type) each iteration to get the next position
    offset: number;         // start at the beginning of the buffer
}

export abstract class ProgramBase {

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

    protected getUniform(uniform: string): WebGLUniformLocation {
        var location = this.gl.getUniformLocation(this.program, uniform);
        if (!location) {
            throw new Error('Error retrieving uniform location');
        }
        return location;
    }

    public clearAndResize() {
        this.clearCanvasTransparent();
        this.resizeViewportWithCanvas();
    }

    protected resizeViewportWithCanvas() {
        resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    protected clearCanvasTransparent() {
        // Clear the canvas by setting the clear color to "transparent" then calling "gl.clear()"
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

    protected assignBufferToAttribute(buffer: WebGLBuffer, attribute: number, instruction: BufferAttributeInstruction) {
        // activate the attribute
        this.gl.enableVertexAttribArray(attribute);  
        // Bind the position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        // Instructions on how to read in attribute value(s) from the buffer
        var size = instruction.size;            // components per iteration
        var type = instruction.type;            // data type (32bit float / etc)
        var normalize = instruction.normalize;  // normalize data flag (scale to 1)
        var stride = instruction.stride;        // 0 = move forward (size * sizeof(type)) each iteration to get the next position
        var offset = instruction.offset;        // start position within the buffer
        // Bind the attribute to the current buffer
        this.gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset)
    }

    protected assign4fToUniform(uniform: WebGLUniformLocation, f1: number, f2: number, f3: number, f4: number) {
        // set the resolution
        this.gl.uniform4f(uniform, f1, f2, f3, f4);
    }
    protected assign2fToUniform(uniform: WebGLUniformLocation, f1: number, f2: number) {
        // set the resolution
        this.gl.uniform2f(uniform, f1, f2);
    }

    protected drawArrays(mode: number, offset: number, count: number) {
        this.gl.drawArrays(mode, offset, count);
    }

}