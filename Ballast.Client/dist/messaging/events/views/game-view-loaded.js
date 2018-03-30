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
exports.GameViewLoaded = Symbol.for('GameViewLoaded');
var GameViewLoadedEvent = /** @class */ (function (_super) {
    __extends(GameViewLoadedEvent, _super);
    function GameViewLoadedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventId = GameViewLoadedEvent.eventId;
        return _this;
    }
    GameViewLoadedEvent.eventId = exports.GameViewLoaded;
    return GameViewLoadedEvent;
}(event_base_1.EventBase));
exports.GameViewLoadedEvent = GameViewLoadedEvent;
//# sourceMappingURL=game-view-loaded.js.map