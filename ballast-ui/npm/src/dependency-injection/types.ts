export const TYPES = {
    IBallastAppState: Symbol.for("IBallastAppState"),
    DependencyInjection: {
        IBallastUiOptions: Symbol.for("IBallastUiOptions")
    },
    Input: {
        KeyboardWatcher: Symbol.for("KeyboardWatcher"),
        IVesselCompass: Symbol.for("IVesselCompass")
    },
    Rendering: {
        CameraTracker: Symbol.for("CameraTracker"),
        Components : {
            CameraComponent: Symbol.for("CameraComponent"),
            ChatComponent: Symbol.for("ChatComponent"),
            NavigationComponent: Symbol.for("NavigationComponent"),
            RootComponent: Symbol.for("RootComponent"),
            SignInComponent: Symbol.for("SignInComponent"),
            WorldComponent: Symbol.for("WorldComponent")
        },
        IRenderer: Symbol.for("IRenderer"),
        IRenderingContext: Symbol.for("IRenderingContext")
    }
};