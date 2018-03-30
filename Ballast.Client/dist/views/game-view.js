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
var view_base_1 = require("./view-base");
var game_view_loaded_1 = require("../messaging/events/views/game-view-loaded");
var GameView = /** @class */ (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameView.prototype.onAttach = function (host) {
        this.canvas = this.createCanvas(host);
        var gameViewLoaded = new game_view_loaded_1.GameViewLoadedEvent();
        this.eventBus.publish(gameViewLoaded.eventId, gameViewLoaded);
    };
    GameView.prototype.createCanvas = function (host) {
        var canvas = host.ownerDocument.createElement("canvas");
        canvas.id = this.clientContext.clientId + '_game';
        canvas.style.display = 'none';
        host.appendChild(canvas);
        return canvas;
    };
    GameView.prototype.show = function () {
        if (this.canvas) {
            this.canvas.style.display = null;
            var context = this.canvas.getContext('2d');
            if (context) {
                context.font = "48px serif";
                context.fillText('BALLAST!', 10, 50);
            }
        }
    };
    GameView.prototype.hide = function () {
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    };
    GameView = __decorate([
        inversify_1.injectable()
    ], GameView);
    return GameView;
}(view_base_1.ViewBase));
exports.GameView = GameView;
//# sourceMappingURL=game-view.js.map