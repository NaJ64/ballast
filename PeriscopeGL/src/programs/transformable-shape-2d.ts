import { Position2D, Shape2D, Translation2D, Rotation2D, Scale2D } from '../types';
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

export class TransformableShape2D extends ProgramApiBase {

    private shape!: Shape2D;
    private initialPosition!: Position2D;
    private initialTranslation!: Translation2D;
    private initialRotation!: Rotation2D;
    private initialScale!: Scale2D;
    private translation!: Translation2D;
    private rotation!: Rotation2D;
    private scale!: Scale2D;
    
    public constructor(
        gl: WebGLRenderingContext,
        shape: Shape2D,
        initialPosition?: Position2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScale?: Scale2D
    ) {
        super(gl, vs, fs);
        this.init(shape, initialPosition, initialTranslation, initialRotation, initialScale);
    }

    public init(
        shape: Shape2D,
        initialPosition?: Position2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScale?: Scale2D
    ) {
        // Defaults
        if (!initialPosition) {
            initialPosition = { x: 0, y: 0 };
        }
        if (!initialTranslation) {
            initialTranslation = { x: 0, y: 0 };
        }
        if (!initialRotation) {
            initialRotation = { radians: 0 };
        }
        if (!initialScale) {
            initialScale = { x: 1, y: 1 };
        }
        // Store initial state
        this.shape = shape;
        this.initialPosition = initialPosition;
        this.translation = this.initialTranslation = initialTranslation;
        this.rotation = this.initialRotation = initialRotation;
        this.scale = this.initialScale = initialScale;
    }

    public reorient() {
        this.translation = this.initialTranslation;
        this.rotation = this.initialRotation;
        this.scale = this.initialScale;
    }

    public translate(translation: Translation2D) {
        this.translation.x += translation.x;
        this.translation.y += translation.y;
    }

    public rotate(rotation: Rotation2D) {
        this.rotation.radians += rotation.radians;
    }

    public rescale(scale: Scale2D) {
        this.scale.x += scale.x;
        this.scale.y += scale.y;
    }

    public render() {

        var data: number[] = [];
        for(var i = 0; i < this.shape.triangles.length; i++) {
            var triangle = this.shape.triangles[i];
            for(var j = 0; j < triangle.vertices.length; j++) {
                var vertex = triangle.vertices[j];
                var x = vertex.x;
                var y = vertex.y;
                data.push(x);
                data.push(y);
            }
        }

        // apply currently set transformations using matrices
        this.applyTransformations(data);

        // set the current program for the gl context
        this.useCurrentProgram();

        // set uniform value(s) for color
        var colorUniform = this.getColorUniform();
        this.assign4fToUniform(colorUniform, Math.random(), Math.random(), Math.random(), 1);

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

    private applyTransformations(data: number[]) {
        return data;
    }

    protected getPositionAttribute(): number {
        return this.getAttribute("a_position");
    }

    protected getColorUniform(): WebGLUniformLocation {
        return this.getUniform("u_color");
    }

    protected getResolutionUniform(): WebGLUniformLocation {
        return this.getUniform("u_resolution");
    }

    private loadDataIntoCurrentBuffer(data: number[]) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }

}