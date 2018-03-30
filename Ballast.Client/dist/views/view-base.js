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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var ballast_client_context_1 = require("../app/ballast-client-context");
var types_1 = require("../ioc/types");
var ViewBase = /** @class */ (function () {
    function ViewBase(clientContext, eventBus) {
        this.clientContext = clientContext;
        this.eventBus = eventBus;
    }
    ViewBase.prototype.attach = function (host) {
        this.host = host;
        this.onAttach(this.host);
    };
    ViewBase.prototype.detach = function () {
        if (this.host) {
            this.onDetach(this.host);
        }
    };
    ViewBase.prototype.onAttach = function (host) { };
    ViewBase.prototype.onDetach = function (host) { };
    ViewBase.prototype.dispose = function () { };
    ViewBase.prototype.enableInteraction = function () { };
    ViewBase.prototype.disableInteraction = function () { };
    ViewBase = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES_BALLAST.BallastClientContext)),
        __param(1, inversify_1.inject(types_1.TYPES_BALLAST.IEventBus)),
        __metadata("design:paramtypes", [ballast_client_context_1.BallastClientContext, Object])
    ], ViewBase);
    return ViewBase;
}());
exports.ViewBase = ViewBase;
//# sourceMappingURL=view-base.js.map