const TYPES_BALLAST = {

    // app
    BallastBootstrapper: Symbol.for('BallastBootstrapper'),
    BallastClient: Symbol.for('BallastClient'),
    BallastClientContext: Symbol.for('BallastClientContext'),
    BallastViewport: Symbol.for('BallastViewport'),

    // controllers
    ChatController: Symbol.for('ChatController'),
    GameController: Symbol.for('GameController'),
    HudController: Symbol.for('HudController'),
    MenuController: Symbol.for('MenuController'),
    RootController: Symbol.for('RootController'),
    SignInController: Symbol.for('SignInController'),
    
    // events
    IEventBus: Symbol.for('IEventBus'),

    // views
    IChatView: Symbol.for('IChatView'),
    IChatViewFactory: Symbol.for('IChatViewFactory'),
    IGameView: Symbol.for('IGameView'),
    IGameViewFactory: Symbol.for('IGameViewFactory'),
    IHudView: Symbol.for('IHudView'),
    IHudViewFactory: Symbol.for('IHudViewFactory'),
    IMenuView: Symbol.for('IMenuView'),
    IMenuViewFactory: Symbol.for('IMenuViewFactory'),
    ISignInView: Symbol.for('ISignInView'),
    ISignInViewFactory: Symbol.for('ISignInViewFactory'),

};

export { TYPES_BALLAST };