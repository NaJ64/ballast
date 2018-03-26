import { ProgramApiBase } from '../util';
export declare type Vertex = {
    x: number;
    y: number;
};
export declare class TriangleProgram extends ProgramApiBase {
    constructor(gl: WebGLRenderingContext);
    render(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }, c: {
        x: number;
        y: number;
    }): void;
    private loadDataIntoCurrentBuffer(data);
    private getPositionAttribute();
}
