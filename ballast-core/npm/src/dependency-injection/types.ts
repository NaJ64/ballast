export const TYPES = {
    Application: {
        IChatService: Symbol.for("IChatService"),
        IGameService: Symbol.for("IGameService"),
        ISignInService: Symbol.for("ISignInService")
    },
    Domain: {
        IBoardGenerator: Symbol.for("IBoardGenerator")
    },
    Messaging: {
        IEventBus: Symbol.for("IEventBus")
    },
}