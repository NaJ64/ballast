export const TYPES = {
    DependencyInjection: {
        IBallastClientOptions: Symbol.for("IBallastClientOptions")
    },
    IClientBootstrapper: Symbol.for("IClientBootstrapper"),
    SignalR: {
        ISignalRClientOptions: Symbol.for("ISignalROptions"),
        ISignalRClientEventSubscriber: Symbol.for("ISignalRClientEventSubscriber")
    }
};