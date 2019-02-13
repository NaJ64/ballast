import { IDisposable } from "../../interfaces/disposable";

export interface IApplicationEventEmitter extends IDisposable {
    isEnabled: boolean;
    startAsync(): Promise<void>;
    stopAsync(): Promise<void>;
}