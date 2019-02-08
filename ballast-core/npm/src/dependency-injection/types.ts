export const TYPES = {
    Application: {
        Services: {
            IChatService: Symbol.for("IChatService"),
            IGameService: Symbol.for("IGameService"),
            ISignInService: Symbol.for("ISignInService")
        }
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