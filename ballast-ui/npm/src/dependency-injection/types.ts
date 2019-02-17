export const TYPES = {
    App: {
        IApplicationContext: Symbol.for("IApplicationContext")
    },
    DependencyInjection: {
        IBallastUiOptions: Symbol.for("IBallastUiOptions")
    },
    Input: {
        KeyboardWatcher:Symbol.for("KeyboardWatcher")
    },
    Rendering: {
        IRenderingComponent: Symbol.for("IRenderingComponent"),
        IRenderingContext: Symbol.for("IRenderingContext"),
        RenderingConstants: Symbol.for("RenderingConstants"),
        RenderingMiddleware: Symbol.for("RenderingMiddleware")
    }
};