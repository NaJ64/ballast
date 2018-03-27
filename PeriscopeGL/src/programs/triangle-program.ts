import { Vertex2D, Translation2D, Rotation2D, Scaling2D } from '../models';
import { Shape2DProgram } from './shape-2d-program';

export class TriangleProgram extends Shape2DProgram {
    public constructor(
        gl: WebGLRenderingContext, 
        vertexA: Vertex2D,
        vertexB: Vertex2D,
        vertexC: Vertex2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScaling?: Scaling2D
    ) {
        super(
            gl, 
            { triangles: [{ vertices: [ vertexA, vertexB, vertexC ] }]},
            initialTranslation, 
            initialRotation, 
            initialScaling
        );
    }
}