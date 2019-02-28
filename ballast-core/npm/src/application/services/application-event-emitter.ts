import { IDisposable } from "../../interfaces/disposable";

export interface IApplicationEventEmitter extends IDisposable {
    isEnabled: boolean;
    start(): void;
    stop(): void;
}