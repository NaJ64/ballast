import { ProgramApiBase } from '../util';
export declare class RectangleProgram extends ProgramApiBase {
    constructor(gl: WebGLRenderingContext);
    render(topLeft: {
        xPixels: number;
        yPixels: number;
    }, widthPixels: number, heightPixels: number, color?: {
        r: number;
        g: number;
        b: number;
        a?: number;
    }): void;
    private loadDataIntoCurrentBuffer(data);
    private getPositionAttribute();
    private getResolutionUniform();
    private getColorUniform();
}
