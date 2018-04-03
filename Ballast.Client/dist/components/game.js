"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var types_1 = require("../ioc/types");
var component_base_1 = require("./component-base");
var game_component_loaded_1 = require("../messaging/events/components/game-component-loaded");
var GameComponent = /** @class */ (function (_super) {
    __extends(GameComponent, _super);
    function GameComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameComponent.prototype.getComponentId = function () {
        return types_1.TYPES_BALLAST.GameComponent;
    };
    GameComponent.prototype.render = function (parent, renderingContext) {
        renderingContext.font = "48px serif";
        renderingContext.fillText(new Date(Date.now()).toLocaleTimeString(), 10, 50);
    };
    GameComponent.prototype.onAttach = function (parent) {
        var loadedEvent = new game_component_loaded_1.GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    };
    GameComponent = __decorate([
        inversify_1.injectable()
    ], GameComponent);
    return GameComponent;
}(component_base_1.ComponentBase));
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.js.map