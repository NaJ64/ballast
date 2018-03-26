import { ProgramApiBase } from '../util';

const vs: string = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;

    void main() {

        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;
     
        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
     
        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;
     
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const fs: string = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;

export class RectangleProgram extends ProgramApiBase {

    public constructor(gl: WebGLRenderingContext) {
        super(gl, vs, fs);
    }

    public render(
        topLeft: {xPixels: number, yPixels: number }, 
        widthPixels: number, 
        heightPixels: number, 
        color?: {r: number, g: number, b: number, a?: number}
    ) {
        if (!color) {
            color = { r: Math.random(), g: Math.random(), b: Math.random(), a: Math.random() };
        }
        if (!color.a) {
            color.a = 1;
        }
        // Convert dimensions to 2 arrays of vertices (two halfs of rectangle)
        var data: number[] = [
            topLeft.xPixels, topLeft.yPixels,
            (topLeft.xPixels + widthPixels), topLeft.yPixels,
            topLeft.xPixels, (topLeft.yPixels + heightPixels),
            (topLeft.xPixels + widthPixels), (topLeft.yPixels + heightPixels),
            (topLeft.xPixels + widthPixels), topLeft.yPixels,
            topLeft.xPixels, (topLeft.yPixels + heightPixels)
        ];
        // set the current program for the gl context
        this.useCurrentProgram();
        // set uniform value(s) for color
        var colorUniform = this.getColorUniform();
        this.assign4fToUniform(colorUniform, color.r, color.g, color.b, color.a);
        // set uniform value(s) for resolution
        var resolutionUniform = this.getResolutionUniform();
        this.assign2fToUniform(resolutionUniform, this.gl.canvas.width, this.gl.canvas.height);
        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();
        // load point data into the current buffer
        this.loadDataIntoCurrentBuffer(data);
        // get location of our vertex attribute
        var positionAttribute = this.getPositionAttribute();
        // map our buffer (data) to the position attribute on the shader (with instruction)
        this.assignBufferToAttribute(buffer, positionAttribute, {
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
        return this.getAttribute('a_position');
    }

    private getResolutionUniform() {
        return this.getUniform("u_resolution");
    }

    private getColorUniform() {
        return this.getUniform("u_color");
    }

}



