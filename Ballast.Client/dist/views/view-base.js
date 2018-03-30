"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var ViewBase = /** @class */ (function () {
    function ViewBase(clientContext) {
        this.clientContext = clientContext;
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
        inversify_1.injectable()
    ], ViewBase);
    return ViewBase;
}());
exports.ViewBase = ViewBase;
//# sourceMappingURL=view-base.js.map