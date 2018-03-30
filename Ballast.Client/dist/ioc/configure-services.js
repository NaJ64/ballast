"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var ballast_bootstrapper_1 = require("../app/ballast-bootstrapper");
var ballast_client_context_1 = require("../app/ballast-client-context");
var chat_controller_1 = require("../controllers/chat-controller");
var game_controller_1 = require("../controllers/game-controller");
var hud_controller_1 = require("../controllers/hud-controller");
var menu_controller_1 = require("../controllers/menu-controller");
var root_controller_1 = require("../controllers/root-controller");
var sign_in_controller_1 = require("../controllers/sign-in-controller");
var event_bus_1 = require("../messaging/event-bus");
var chat_view_1 = require("../views/chat-view");
var game_view_1 = require("../views/game-view");
var hud_view_1 = require("../views/hud-view");
var menu_view_1 = require("../views/menu-view");
var sign_in_view_1 = require("../views/sign-in-view");
function configureServices(container, client) {
    configureApp(container, client);
    configureControllers(container);
    configureMessaging(container);
    configureViews(container);
    return container;
}
exports.configureServices = configureServices;
function configureApp(container, client) {
    var clientContext = new ballast_client_context_1.BallastClientContext(client);
    container.bind(types_1.TYPES_BALLAST.BallastBootstrapper)
        .to(ballast_bootstrapper_1.BallastBootstrapper)
        .inSingletonScope();
    container.bind(types_1.TYPES_BALLAST.BallastClientContext)
        .toConstantValue(clientContext);
    container.bind(types_1.TYPES_BALLAST.BallastClient)
        .toConstantValue(clientContext.client);
    container.bind(types_1.TYPES_BALLAST.BallastViewport)
        .toConstantValue(clientContext.client.getViewport());
    return container;
}
function configureControllers(container) {
    container.bind(types_1.TYPES_BALLAST.ChatController)
        .to(chat_controller_1.ChatController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.GameController)
        .to(game_controller_1.GameController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.HudController)
        .to(hud_controller_1.HudController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.MenuController)
        .to(menu_controller_1.MenuController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.RootController)
        .to(root_controller_1.RootController)
        .inSingletonScope(); // Singleton scope
    container.bind(types_1.TYPES_BALLAST.SignInController)
        .to(sign_in_controller_1.SignInController)
        .inTransientScope();
    return container;
}
function configureMessaging(container) {
    container.bind(types_1.TYPES_BALLAST.IEventBus)
        .to(event_bus_1.EventBus)
        .inSingletonScope();
    return container;
}
function configureViews(container) {
    container.bind(types_1.TYPES_BALLAST.IChatView)
        .to(chat_view_1.ChatView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IChatViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IChatView); }; });
    container.bind(types_1.TYPES_BALLAST.IGameView)
        .to(game_view_1.GameView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IGameViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IGameView); }; });
    container.bind(types_1.TYPES_BALLAST.IHudView)
        .to(hud_view_1.HudView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IHudViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IHudView); }; });
    container.bind(types_1.TYPES_BALLAST.IMenuView)
        .to(menu_view_1.MenuView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IMenuViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IMenuView); }; });
    container.bind(types_1.TYPES_BALLAST.ISignInView)
        .to(sign_in_view_1.SignInView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.ISignInViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.ISignInView); }; });
    return container;
}
//# sourceMappingURL=configure-services.js.map