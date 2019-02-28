export interface IClientBootstrapper {
    connectAsync(): Promise<void>;
}