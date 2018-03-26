import { ProgramApiBase } from '../util';
export interface TriangleVertex {
    x: number;
    y: number;
}
export declare class TriangleProgram extends ProgramApiBase {
    constructor(gl: WebGLRenderingContext);
    init(): void;
    clear(): void;
    rerender(a: TriangleVertex, b: TriangleVertex, c: TriangleVertex): void;
    render(a: TriangleVertex, b: TriangleVertex, c: TriangleVertex): void;
    private loadPositionDataIntoCurrentBuffer(positions);
    private getPositionAttribute();
}
