import { Shape2D, Translation2D, Rotation2D, Scaling2D } from '../models';
import { ProgramBase } from './program-base';
export declare class Shape2DProgram extends ProgramBase {
    private shape;
    private initialTranslation;
    private initialRotation;
    private initialScaling;
    private translation;
    private rotation;
    private scaling;
    constructor(gl: WebGLRenderingContext, shape: Shape2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScaling?: Scaling2D);
    init(shape: Shape2D, initialTranslation?: Translation2D, initialRotation?: Rotation2D, initialScaling?: Scaling2D, originOffset?: Translation2D): void;
    reorient(): void;
    translate(translation: Translation2D): void;
    rotate(rotation: Rotation2D): void;
    scale(scaling: Scaling2D): void;
    render(): void;
    private getTransformationMatrix();
    private getVertices(shape);
    protected getPositionAttribute(): number;
    protected getColorUniform(): WebGLUniformLocation;
    protected getMatrixUniform(): WebGLUniformLocation;
    private loadDataIntoCurrentBuffer(data);
}
