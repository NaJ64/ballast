"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var ballast_bootstrapper_1 = require("../app/ballast-bootstrapper");
var ballast_client_context_1 = require("../app/ballast-client-context");
var event_bus_1 = require("../messaging/event-bus");
var chat_1 = require("../components/chat");
var game_1 = require("../components/game");
var hud_1 = require("../components/hud");
var menu_1 = require("../components/menu");
var root_1 = require("../components/root");
var sign_in_1 = require("../components/sign-in");
function configureServices(container, client) {
    configureApp(container, client);
    configureMessaging(container);
    configureComponents(container);
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
function configureComponents(container) {
    // ChatComponent
    container.bind(types_1.TYPES_BALLAST.ChatComponent)
        .to(chat_1.ChatComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.ChatComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.ChatComponent); }; });
    // GameComponent
    container.bind(types_1.TYPES_BALLAST.GameComponent)
        .to(game_1.GameComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.GameComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.GameComponent); }; });
    // HudComponent
    container.bind(types_1.TYPES_BALLAST.HudComponent)
        .to(hud_1.HudComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.HudComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.HudComponent); }; });
    // MenuComponent
    container.bind(types_1.TYPES_BALLAST.MenuComponent)
        .to(menu_1.MenuComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.MenuComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.MenuComponent); }; });
    // RootComponent
    container.bind(types_1.TYPES_BALLAST.RootComponent)
        .to(root_1.RootComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.RootComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.RootComponent); }; });
    // SignInComponent
    container.bind(types_1.TYPES_BALLAST.SignInComponent)
        .to(sign_in_1.SignInComponent)
        .inTransientScope();
    container.bind(types_1.TYPES_BALLAST.SignInComponentFactory)
        .toFactory(function (context) { return function () { return context.container.get(types_1.TYPES_BALLAST.SignInComponent); }; });
    return container;
}
function configureMessaging(container) {
    container.bind(types_1.TYPES_BALLAST.IEventBus)
        .to(event_bus_1.EventBus)
        .inSingletonScope();
    return container;
}
//# sourceMappingURL=configure-services.js.map