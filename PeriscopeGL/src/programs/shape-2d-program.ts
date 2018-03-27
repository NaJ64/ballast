import { Shape2D, Translation2D, Rotation2D, Scaling2D } from '../models';
import * as m3 from '../utilities/matrix-3x3';
import { ProgramBase } from './program-base';

const vs: string = `

    attribute vec2 a_position;

    uniform mat3 u_matrix;

    void main() {

        // Multiply the position by the matrix.
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    
    }

`;

const fs: string = `

    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
    
`;

export class Shape2DProgram extends ProgramBase {

    private shape!: Shape2D;
    private initialTranslation!: Translation2D;
    private initialRotation!: Rotation2D;
    private initialScaling!: Scaling2D;
    private translation!: Translation2D;
    private rotation!: Rotation2D;
    private scaling!: Scaling2D;
    
    public constructor(
        gl: WebGLRenderingContext,
        shape: Shape2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScaling?: Scaling2D
    ) {
        super(gl, vs, fs);
        this.init(shape, initialTranslation, initialRotation, initialScaling);
    }

    public init(
        shape: Shape2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScaling?: Scaling2D,
        originOffset?: Translation2D
    ) {
        // Defaults
        if (!initialTranslation) {
            initialTranslation = { x: 0, y: 0 };
        }
        if (!initialRotation) {
            initialRotation = { radians: 0 };
        }
        if (!initialScaling) {
            initialScaling = { x: 1, y: 1 };
        }
        // Store initial state
        this.shape = shape;
        this.translation = this.initialTranslation = initialTranslation;
        this.rotation = this.initialRotation = initialRotation;
        this.scaling = this.initialScaling = initialScaling;
    }

    public reorient() {
        this.translation = this.initialTranslation;
        this.rotation = this.initialRotation;
        this.scaling = this.initialScaling;
    }

    public translate(translation: Translation2D) {
        this.translation.x = (this.translation.x || 0) + (translation.x || 0);
        this.translation.y = (this.translation.y || 0) + (translation.y || 0);
    }

    public rotate(rotation: Rotation2D) {
        this.rotation.radians += rotation.radians;
    }

    public scale(scaling: Scaling2D) {
        this.scaling.x = (this.scaling.x || 1) * (scaling.x || 1);
        this.scaling.y = (this.scaling.y || 1) * (scaling.y || 1);
    }

    public render() {

        // Flatten vertices
        var vertices = this.getVertices(this.shape);

        // apply current transformations to shape(s) using matrices
        var transformations = this.getTransformationMatrix();

        // set the current program for the gl context
        this.useCurrentProgram();

        // set uniform value(s) for transformation matrix
        this.assignMat3fToUniform(this.getMatrixUniform(), transformations);

        // set uniform value(s) for color
        this.assign4fToUniform(this.getColorUniform(), Math.random(), Math.random(), Math.random(), 1);

        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();

        // load point data into the current buffer
        this.loadDataIntoCurrentBuffer(vertices);

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
        let count = Math.floor(vertices.length / 2);

        // draw using mode "TRIANGLES"
        this.drawArrays(this.gl.TRIANGLES, 0, count);

    }

    private getTransformationMatrix(): number[] {  
        // determine projection (resolution) matrix
        var projectionMatrix = m3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        // compute matrices  
        var translationMatrix = m3.translation(this.translation.x || 0, this.translation.y || 0);
        var rotationMatrix = m3.rotation(this.rotation.radians);
        var scalingMatrix = m3.scaling(this.scaling.x || 1, this.scaling.y || 1);
        // multiply the matrices
        var matrix = m3.multiply(projectionMatrix, translationMatrix);
        matrix = m3.multiply(matrix, rotationMatrix);
        matrix = m3.multiply(matrix, scalingMatrix);
        // return the new transformation matrix
        return matrix;
    }

    private getVertices(shape: Shape2D) {
        // Flatten vertices
        var vertices: number[] = [];
        for(var i = 0; i < shape.triangles.length; i++) {
            var triangle = shape.triangles[i];
            for(var j = 0; j < triangle.vertices.length; j++) {
                var vertex = triangle.vertices[j];
                var x = vertex.x;
                var y = vertex.y;
                vertices.push(x);
                vertices.push(y);
            }
        }
        return vertices;
    }

    protected getPositionAttribute(): number {
        return this.getAttribute("a_position");
    }

    protected getColorUniform(): WebGLUniformLocation {
        return this.getUniform("u_color");
    }

    protected getMatrixUniform(): WebGLUniformLocation {
        return this.getUniform("u_matrix");
    }

    private loadDataIntoCurrentBuffer(data: number[]) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }

}