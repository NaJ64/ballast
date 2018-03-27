import { Shape2D, Translation2D, Rotation2D, Scale2D } from '../models';
import { ProgramBase } from './program-base';
export declare class TransformableShape2D extends ProgramBase {
    private shape;
    private initialTranslation;
    private initialRotation;
    private initialScale;
    private translation;
    private rotation;
    private scale;
    constructor(gl: WebGLRenderingContext, shape: Shape2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScale?: Scale2D);
    init(shape: Shape2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScale?: Scale2D): void;
    reorient(): void;
    translate(translation: Translation2D): void;
    rotate(rotation: Rotation2D): void;
    rescale(scale: Scale2D): void;
    render(): void;
    private applyTransformations(shape);
    private getVertices(shape);
    protected getPositionAttribute(): number;
    protected getColorUniform(): WebGLUniformLocation;
    protected getResolutionUniform(): WebGLUniformLocation;
    private loadDataIntoCurrentBuffer(data);
}
