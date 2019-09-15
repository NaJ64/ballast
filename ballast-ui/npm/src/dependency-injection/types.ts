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
            BoardComponent: Symbol.for("BoardComponent"),
            CameraComponent: Symbol.for("CameraComponent"),
            ChatComponent: Symbol.for("ChatComponent"),
            GameComponent: Symbol.for("GameComponent"),
            MiniMapComponent: Symbol.for("MiniMapComponent"),
            NavigationComponent: Symbol.for("NavigationComponent"),
            RootComponent: Symbol.for("RootComponent"),
            SignInComponent: Symbol.for("SignInComponent"),
            WorldComponent: Symbol.for("WorldComponent")
        },
        IRenderingController: Symbol.for("IRenderingController"),
        IRenderingContext: Symbol.for("IRenderingContext")
    }
};