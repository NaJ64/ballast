export const TYPES = {
    DependencyInjection: {
        IBallastUiOptions: Symbol.for("IBallastUiOptions")
    },
    IApplicationContext: Symbol.for("IApplicationContext"),
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