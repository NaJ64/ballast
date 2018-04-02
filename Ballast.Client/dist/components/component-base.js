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
var types_1 = require("../ioc/types");
var ballast_viewport_1 = require("../app/ballast-viewport");
var ComponentBase = /** @class */ (function () {
    function ComponentBase(viewport, eventBus) {
        this.viewport = viewport;
        this.eventBus = eventBus;
        this.isAttached = false;
    }
    ComponentBase.prototype.attach = function (parent) {
        this.parent = parent;
        this.isAttached = true;
        this.onAttach(this.parent);
        this.addRenderingStep();
    };
    ComponentBase.prototype.detach = function () {
        this.removeRenderingStep();
        if (this.parent) {
            this.onDetach(this.parent);
        }
        this.isAttached = false;
    };
    ComponentBase.prototype.addRenderingStep = function () {
        var _this = this;
        var componentId = this.getComponentId();
        var parent = this.parent; // Rendering step only gets added after attaching to parent element
        this.viewport.addRenderingStep(componentId, function (renderingContext, next) {
            if (_this.isAttached) {
                _this.render(parent, renderingContext);
            }
            next();
        });
    };
    ComponentBase.prototype.removeRenderingStep = function () {
        var componentId = this.getComponentId();
        this.viewport.removeRenderingStep(componentId);
    };
    ComponentBase.prototype.onAttach = function (parent) { };
    ComponentBase.prototype.onDetach = function (parent) { };
    ComponentBase.prototype.dispose = function () { };
    ComponentBase.prototype.enableInteraction = function () { };
    ComponentBase.prototype.disableInteraction = function () { };
    ComponentBase = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES_BALLAST.BallastViewport)),
        __param(1, inversify_1.inject(types_1.TYPES_BALLAST.IEventBus)),
        __metadata("design:paramtypes", [ballast_viewport_1.BallastViewport, Object])
    ], ComponentBase);
    return ComponentBase;
}());
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=component-base.js.map