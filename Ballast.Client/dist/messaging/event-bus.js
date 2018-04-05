"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.subscriptions = new Map();
    }
    EventBus.prototype.getHandlers = function (key) {
        // get subscription list
        var subscriptions = this.getSubscriptions(key);
        // return projection to list of handler functions
        return subscriptions.map(function (x) { return x.handler; });
    };
    EventBus.prototype.getSubscriptions = function (key) {
        // check if the current event signature/key already exists
        if (!this.subscriptions.has(key)) {
            // set to new collection
            this.subscriptions.set(key, []);
        }
        // return the subscription list
        return this.subscriptions.get(key) || [];
    };
    EventBus.prototype.dispose = function () {
        // loop through all events
        this.subscriptions.forEach(function (subscription, key, map) {
            // empty the subscriber collection for the current event
            subscription.length = 0;
        });
        // clear all mapped event subscriptions
        this.subscriptions.clear();
    };
    EventBus.prototype.publish = function (key, event) {
        // Get all subscribers for the current event key
        var subscriptions = this.getSubscriptions(key);
        // Loop through the subscribers
        for (var _i = 0, subscriptions_1 = subscriptions; _i < subscriptions_1.length; _i++) {
            var subscription = subscriptions_1[_i];
            // invoke the handler(s)
            subscription.handler(event);
        }
    };
    EventBus.prototype.subscribe = function (key, handler) {
        // Get all subscribers for the current event key
        var subscriptions = this.getSubscriptions(key);
        // Add a new handler
        subscriptions.push({ key: key, handler: handler });
    };
    EventBus.prototype.unsubscribe = function (key, handler) {
        // Get all subscribers for the current event key
        var subscriptions = this.getSubscriptions(key);
        // Find an index to remove where subscription.handler has reference equality
        var removeIndex = -1;
        for (var i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].handler == handler) {
                removeIndex = i;
                break;
            }
        }
        // If the handler index was obtained
        if (removeIndex >= 0) {
            // remove the subscription from the collection
            subscriptions.splice(removeIndex, 1);
        }
    };
    EventBus = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], EventBus);
    return EventBus;
}());
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map