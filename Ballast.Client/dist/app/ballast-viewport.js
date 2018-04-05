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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var inversify_1 = require("inversify");
var rendering_context_1 = require("../rendering/rendering-context");
var keyboard_watcher_1 = require("../input/keyboard-watcher");
var BallastViewport = /** @class */ (function () {
    function BallastViewport(host, clientId) {
        var _this = this;
        this.prerender = function (renderingContext) {
            // initial render step goes here
            _this.resizeCanvas(renderingContext.canvas);
            if (renderingContext.threeWebGLRenderer) {
                renderingContext.threeWebGLRenderer.setSize(renderingContext.canvas.clientWidth, renderingContext.canvas.clientHeight, false);
            }
            if (renderingContext.threePerspectiveCamera) {
                var aspect = renderingContext.canvas.clientWidth / renderingContext.canvas.clientHeight;
                renderingContext.threePerspectiveCamera.aspect = aspect;
                renderingContext.threePerspectiveCamera.updateProjectionMatrix();
            }
        };
        this.postrender = function (renderingContext, next) {
            // final render step goes here
            if (renderingContext &&
                renderingContext.threeWebGLRenderer &&
                renderingContext.threeScene &&
                renderingContext.threePerspectiveCamera) {
                renderingContext.threeWebGLRenderer.render(renderingContext.threeScene, renderingContext.threePerspectiveCamera);
            }
        };
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
        this.keyboardWatcher = this.createKeyboardWatcher(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas, this.keyboardWatcher);
        this.renderingSteps = this.createRenderingSteps();
    }
    BallastViewport.prototype.getRoot = function () {
        return this.root;
    };
    BallastViewport.prototype.getCanvas = function () {
        return this.canvas;
    };
    BallastViewport.prototype.getKeyboardWatcher = function () {
        return this.keyboardWatcher;
    };
    BallastViewport.prototype.getRenderingContext = function () {
        return this.renderingContext;
    };
    BallastViewport.prototype.getRenderingSteps = function () {
        return Array.from(this.renderingSteps.values());
    };
    BallastViewport.prototype.createRoot = function (host, id) {
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        root.style.height = '100%';
        root.style.width = '100%';
        host.appendChild(root);
        return root;
    };
    BallastViewport.prototype.createCanvas = function (root) {
        var renderer = new THREE.WebGLRenderer();
        var canvas = root.ownerDocument.createElement('canvas');
        canvas.id = root.id + '_canvas';
        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        root.appendChild(canvas);
        return canvas;
    };
    BallastViewport.prototype.createKeyboardWatcher = function (root) {
        return new keyboard_watcher_1.KeyboardWatcher(root);
    };
    BallastViewport.prototype.createRenderingContext = function (canvas, keyboardWatcher) {
        return new rendering_context_1.RenderingContext(canvas, keyboardWatcher);
    };
    BallastViewport.prototype.createRenderingSteps = function () {
        return new Map();
    };
    BallastViewport.prototype.resizeCanvas = function (canvas) {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;
        // Check if the canvas is not the same size.
        if (canvas.width != displayWidth ||
            canvas.height != displayHeight) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    };
    BallastViewport.prototype.renderLoop = function () {
        var _this = this;
        this.render();
        requestAnimationFrame(function () { return _this.renderLoop(); });
    };
    BallastViewport.prototype.render = function () {
        var _this = this;
        var renderingSteps = this.getRenderingSteps();
        var i = renderingSteps.length;
        var next = function (renderingContext, next) { return _this.postrender.call(_this, _this.renderingContext, next); };
        this.prerender(this.renderingContext);
        while (i--) {
            next = renderingSteps[i].call(this, this.renderingContext, next);
        }
    };
    BallastViewport.prototype.addRenderingStep = function (id, renderingStep) {
        this.renderingSteps.set(id, renderingStep);
    };
    BallastViewport.prototype.removeRenderingStep = function (id) {
        this.renderingSteps.delete(id);
    };
    BallastViewport.prototype.startRenderLoop = function () {
        this.renderLoop();
    };
    BallastViewport = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [HTMLElement, String])
    ], BallastViewport);
    return BallastViewport;
}());
exports.BallastViewport = BallastViewport;
//# sourceMappingURL=ballast-viewport.js.map