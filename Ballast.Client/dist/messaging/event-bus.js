"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var EventBus = /** @class */ (function () {
    function EventBus() {
    }
    EventBus.prototype.dispose = function () {
        // TODO:  Implement this by disposing of all event subscriptions/handler(s)
    };
    EventBus.prototype.subscribe = function (eventSignature, handler) {
        // TODO:  Implement this with a local map of handler(s) to event signature(s)
    };
    EventBus.prototype.subscribeOnce = function (eventSignature, handler) {
        // TODO:  Implement this with a local map of handler(s) to event signature(s)
    };
    EventBus.prototype.publish = function (eventSignature, event) {
        // TODO:  Implement this by calling all subscriber(s)/handler(s) (and then removing any if necessary)
    };
    EventBus = __decorate([
        inversify_1.injectable()
    ], EventBus);
    return EventBus;
}());
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map