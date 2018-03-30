import { IDisposable } from "../../interfaces";
export interface IView extends IDisposable {
    show(): void;
    hide(): void;
    disableInteraction(): void;
    enableInteraction(): void;
}
