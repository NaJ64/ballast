import { Position2D, Shape2D, Translation2D, Rotation2D, Scale2D } from '../types';
import { ProgramApiBase } from '../util';
export declare class TransformableShape2D extends ProgramApiBase {
    private shape;
    private initialPosition;
    private initialTranslation;
    private initialRotation;
    private initialScale;
    private translation;
    private rotation;
    private scale;
    constructor(gl: WebGLRenderingContext, shape: Shape2D, initialPosition?: Position2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScale?: Scale2D);
    init(shape: Shape2D, initialPosition?: Position2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScale?: Scale2D): void;
    reorient(): void;
    translate(translation: Translation2D): void;
    rotate(rotation: Rotation2D): void;
    rescale(scale: Scale2D): void;
    render(): void;
    private applyTransformations(data);
    protected getPositionAttribute(): number;
    protected getColorUniform(): WebGLUniformLocation;
    protected getResolutionUniform(): WebGLUniformLocation;
    private loadDataIntoCurrentBuffer(data);
}
