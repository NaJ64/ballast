"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventBase = /** @class */ (function () {
    function EventBase() {
    }
    Object.defineProperty(EventBase, "eventId", {
        get: function () {
            throw new Error("Event signature is missing / not implemented!");
        },
        enumerable: true,
        configurable: true
    });
    return EventBase;
}());
exports.EventBase = EventBase;
//# sourceMappingURL=event-base.js.map