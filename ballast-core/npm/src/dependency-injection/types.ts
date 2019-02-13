export const TYPES = {
    Application: {
        Services: {
            IApplicationEventEmitter: Symbol.for("IApplicationEventEmitter"),
            IChatService: Symbol.for("IChatService"),
            IGameService: Symbol.for("IGameService"),
            ISignInService: Symbol.for("ISignInService")
        }
    },
    DependencyInjection: {
        IBallastCoreOptions: Symbol.for("IBallastCoreOptions")
    },
    Domain: {
        Services: {
            IBoardGenerator: Symbol.for("IBoardGenerator")
        }
    },
    Messaging: {
        IEventBus: Symbol.for("IEventBus")
    },
}