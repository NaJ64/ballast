"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var app_1 = require("../app");
var controllers_1 = require("../controllers");
var messaging_1 = require("../messaging");
var views_1 = require("../views");
function configureServices(container, client) {
    configureApp(container, client);
    configureControllers(container);
    configureMessaging(container);
    configureViews(container);
    return container;
}
exports.configureServices = configureServices;
function configureApp(container, client) {
    var clientContext = new app_1.BallastClientContext(client);
    container.bind(types_1.TYPES_BALLAST.BallastBootstrapper)
        .to(app_1.BallastBootstrapper)
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
        .to(controllers_1.ChatController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.GameController)
        .to(controllers_1.GameController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.HudController)
        .to(controllers_1.HudController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.MenuController)
        .to(controllers_1.MenuController)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.RootController)
        .to(controllers_1.RootController)
        .inSingletonScope(); // Singleton scope
    container.bind(types_1.TYPES_BALLAST.SignInController)
        .to(controllers_1.SignInController)
        .inTransientScope();
    return container;
}
function configureMessaging(container) {
    container.bind(types_1.TYPES_BALLAST.IEventBus)
        .to(messaging_1.EventBus)
        .inSingletonScope();
    return container;
}
function configureViews(container) {
    container.bind(types_1.TYPES_BALLAST.IChatView)
        .to(views_1.ChatView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IChatViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IChatView); }; });
    container.bind(types_1.TYPES_BALLAST.IGameView)
        .to(views_1.ChatView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IGameViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IGameView); }; });
    container.bind(types_1.TYPES_BALLAST.IHudView)
        .to(views_1.ChatView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IHudViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IHudView); }; });
    container.bind(types_1.TYPES_BALLAST.IMenuView)
        .to(views_1.MenuView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.IMenuViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.IMenuView); }; });
    container.bind(types_1.TYPES_BALLAST.ISignInView)
        .to(views_1.SignInView)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.ISignInViewFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.ISignInView); }; });
    return container;
}
//# sourceMappingURL=configure-services.js.map