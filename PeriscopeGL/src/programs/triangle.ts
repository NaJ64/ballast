import { ProgramApiBase } from '../util';

const vs: string = `
    attribute vec4 attr_position;

    void main() {
        gl_Position = attr_position;
    }
`;

const fs: string = `
    precision mediump float;
    
    void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1);
    }
`;

export type Vertex = {x: number, y: number };

export class TriangleProgram extends ProgramApiBase {

    public constructor(gl: WebGLRenderingContext) {
        super(gl, vs, fs);
    }

    public render(
        a: {x: number, y: number },
        b: {x: number, y: number }, 
        c: {x: number, y: number }
    ) {
        // Convert vertices to array
        var data: number[] = [
            a.x, a.y,
            b.x, b.y,
            c.x, c.y
        ];
        // set the current program for the gl context
        this.useCurrentProgram();
        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();
        // load point data into the current buffer
        this.loadDataIntoCurrentBuffer(data);
        // get location of our vertex attribute
        var attribute = this.getPositionAttribute();
        // map our buffer (data) to the position attribute on the shader (with instruction)
        this.assignBufferToAttribute(buffer, attribute, {
            size: 2,                // 2 components per iteration
            type: this.gl.FLOAT,    // the data is 32bit floats
            normalize: false,       // don't normalize the data
            stride: 0,              // 0 = move forward size * sizeof(type) each iteration to get the next position
            offset: 0               // start at the beginning of the buffer
        });
        // determine the number of times to draw (based on number of points)
        let count = Math.floor(data.length / 2);
        // draw using mode "TRIANGLES"
        this.drawArrays(this.gl.TRIANGLES, 0, count);
    }

    private loadDataIntoCurrentBuffer(data: number[]) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }

    private getPositionAttribute() {
        // locate using name of attribute
        return this.getAttribute('attr_position');
    }

}