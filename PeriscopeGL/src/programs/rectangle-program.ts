import { Vertex2D, Translation2D, Rotation2D, Scaling2D } from '../models';
import { Shape2DProgram } from './shape-2d-program';

export class RectangleProgram extends Shape2DProgram {
    public constructor(
        gl: WebGLRenderingContext, 
        height: number,
        width: number,
        topLeftVertex?: Vertex2D,
        initialTranslation?: Translation2D,
        initialRotation?: Rotation2D,
        initialScaling?: Scaling2D
    ) {
        if (!topLeftVertex) {
            topLeftVertex = { x: 0, y: 0 };
        }
        var topRightVertex: Vertex2D = { 
            x: topLeftVertex.x + width,
            y: topLeftVertex.y
        };
        var bottomLeftVertex: Vertex2D = {
            x: topLeftVertex.x,
            y: topLeftVertex.y + height
        };
        var bottomRightVertex: Vertex2D = {
            x: topLeftVertex.x + width,
            y: topLeftVertex.y + height
        };
        super(
            gl, 
            { triangles: [
                { vertices: [ topLeftVertex, topRightVertex, bottomLeftVertex ] },
                { vertices: [ bottomLeftVertex, topRightVertex, bottomRightVertex ] }
            ]}, 
            initialTranslation, 
            initialRotation, 
            initialScaling
        );
    }
}