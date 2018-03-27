import { Vertex2D, Translation2D, Rotation2D, Scaling2D } from '../models';
import { Shape2DProgram } from './shape-2d-program';
export declare class RectangleProgram extends Shape2DProgram {
    constructor(gl: WebGLRenderingContext, height: number, width: number, topLeftVertex?: Vertex2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScaling?: Scaling2D);
}
