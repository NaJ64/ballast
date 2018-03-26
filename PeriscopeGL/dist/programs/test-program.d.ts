import { ProgramApiBase } from '../util';
export interface TriangleData {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    cx: number;
    cy: number;
}
export declare class TriangleProgramApi extends ProgramApiBase {
    constructor(gl: WebGLRenderingContext);
    render(triangleData: TriangleData): void;
    private loadPositionDataIntoCurrentBuffer(positions);
    private getPositionAttribute();
}
