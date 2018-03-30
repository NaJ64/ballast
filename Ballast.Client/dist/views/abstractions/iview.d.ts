import { IDisposable } from "../../interfaces";
export interface IView extends IDisposable {
    attach(host: HTMLElement): void;
    show(): void;
    hide(): void;
    disableInteraction(): void;
    enableInteraction(): void;
}
