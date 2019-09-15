import { IRenderingContext } from "./rendering-context";

export interface IRenderer {
    render(renderingContext: IRenderingContext): void;
}