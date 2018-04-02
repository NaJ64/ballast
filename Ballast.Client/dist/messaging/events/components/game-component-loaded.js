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
Object.defineProperty(exports, "__esModule", { value: true });
var event_base_1 = require("../../event-base");
exports.GameComponentLoaded = Symbol.for('GameComponentLoaded');
var GameComponentLoadedEvent = /** @class */ (function (_super) {
    __extends(GameComponentLoadedEvent, _super);
    function GameComponentLoadedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventId = GameComponentLoadedEvent.eventId;
        return _this;
    }
    GameComponentLoadedEvent.eventId = exports.GameComponentLoaded;
    return GameComponentLoadedEvent;
}(event_base_1.EventBase));
exports.GameComponentLoadedEvent = GameComponentLoadedEvent;
//# sourceMappingURL=game-component-loaded.js.map