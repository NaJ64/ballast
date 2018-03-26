import { ProgramApiBase } from '../util';

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

export interface TriangleVertex {
    x: number;
    y: number;
}

export class TriangleProgram extends ProgramApiBase {

    public constructor(gl: WebGLRenderingContext) {
        super(gl, vs, fs);
    }

    public init() {
        this.clear();
        this.resizeViewportWithCanvas();
    }

    public clear() {
        // clear canvas
        this.clearCanvasTransparent();
    }

    public rerender(a: TriangleVertex, b: TriangleVertex, c: TriangleVertex) {
        this.clear();
        this.render(a, b, c);
    }

    public render(a: TriangleVertex, b: TriangleVertex, c: TriangleVertex) {

        // Convert vertices to array
        var positions: number[] = [
            a.x, a.y,
            b.x, b.y,
            c.x, c.y
        ];
        
        // set the current program for the gl context
        this.useCurrentProgram();

        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();

        // load point data into the current buffer
        this.loadPositionDataIntoCurrentBuffer(positions);

        // get location of our vertext attribute
        var attribute = this.getPositionAttribute();

        // map our buffer (data) to the position attribute on the shader (with instruction)
        this.setBufferForAttribute(buffer, attribute, {
            size: 2,                // 2 components per iteration
            type: this.gl.FLOAT,    // the data is 32bit floats
            normalize: false,       // don't normalize the data
            stride: 0,              // 0 = move forward size * sizeof(type) each iteration to get the next position
            offset: 0               // start at the beginning of the buffer
        });

        // determine the number of times to draw (based on number of points)
        let count = Math.floor(positions.length / 2)

        // draw using mode "TRIANGLES"
        this.drawArrays(this.gl.TRIANGLES, 0, count);

    }

    private loadPositionDataIntoCurrentBuffer(positions: number[]) {
        // create new floating point array from position data
        var data = new Float32Array(positions);
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    }

    private getPositionAttribute() {
        // locate using name of attribute
        return this.getAttribute('a_position');
    }

}