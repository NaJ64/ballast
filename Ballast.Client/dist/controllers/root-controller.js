"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var ioc_1 = require("../ioc");
var messaging_1 = require("../messaging");
var RootController = /** @class */ (function () {
    function RootController(eventBus, chatViewFactory, gameViewFactory, hudViewFactory, menuViewFactory, signInViewFactory) {
        this.eventBus = eventBus;
        this.chatViewFactory = chatViewFactory;
        this.gameViewFactory = gameViewFactory;
        this.hudViewFactory = hudViewFactory;
        this.menuViewFactory = menuViewFactory;
        this.signInViewFactory = signInViewFactory;
        this.subscribeAllViewEvents();
    }
    RootController.prototype.subscribeAllViewEvents = function () {
        this.eventBus.subscribe(messaging_1.GameViewLoadedEvent.eventId, function (event) {
            console.log('Game view was loaded');
        });
    };
    RootController = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(ioc_1.TYPES_BALLAST.IEventBus)),
        __param(1, inversify_1.inject(ioc_1.TYPES_BALLAST.IChatViewFactory)),
        __param(2, inversify_1.inject(ioc_1.TYPES_BALLAST.IGameViewFactory)),
        __param(3, inversify_1.inject(ioc_1.TYPES_BALLAST.IHudViewFactory)),
        __param(4, inversify_1.inject(ioc_1.TYPES_BALLAST.IMenuViewFactory)),
        __param(5, inversify_1.inject(ioc_1.TYPES_BALLAST.ISignInViewFactory))
    ], RootController);
    return RootController;
}());
exports.RootController = RootController;
//# sourceMappingURL=root-controller.js.map