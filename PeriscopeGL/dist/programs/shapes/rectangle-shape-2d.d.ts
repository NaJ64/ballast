import { Vertex2D, Translation2D, Rotation2D, Scale2D } from '../../models';
import { TransformableShape2D } from '../transformable-shape-2d';
export declare class RectangleShape2D extends TransformableShape2D {
    constructor(gl: WebGLRenderingContext, height: number, width: number, topLeftVertex?: Vertex2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScale?: Scale2D);
}
