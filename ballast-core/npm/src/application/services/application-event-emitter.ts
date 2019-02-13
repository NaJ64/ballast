export interface IApplicationEventEmitter {
    isEnabled: boolean;
    startAsync(): Promise<void>;
    stopAsync(): Promise<void>;
}