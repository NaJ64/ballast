export const TYPES = {
    IAppContext: Symbol.for("IAppContext"),
    DependencyInjection: {
        IBallastUiOptions: Symbol.for("IBallastUiOptions")
    },
    Input: {
        KeyboardWatcher:Symbol.for("KeyboardWatcher")
    },
    Rendering: {
        IRenderingContext: Symbol.for("IRenderingContext"),
        IRenderer: Symbol.for("IRenderer"),
        RenderingComponents : {
            ChatComponent: Symbol.for("ChatComponent"),
            RootComponent: Symbol.for("RootComponent"),
            SignInComponent: Symbol.for("SignInComponent"),
        },
        RenderingConstants: Symbol.for("RenderingConstants"),
        RenderingContextFactory: Symbol.for("RenderingContextFactory"),
        RenderingMiddleware: Symbol.for("RenderingMiddleware")
    },
    Three: {
        NavigationComponent: Symbol.for("NavigationComponent")
    }
};