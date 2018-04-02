"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BallastViewport = /** @class */ (function () {
    function BallastViewport(host, clientId) {
        this.postrender = function (renderingContext, next) {
            // final render step goes here
        };
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
        this.renderingContext = this.createRenderingContext(this.canvas);
        this.renderingSteps = new Map();
    }
    BallastViewport.prototype.getRoot = function () {
        return this.root;
    };
    BallastViewport.prototype.getRenderingSteps = function () {
        return Array.from(this.renderingSteps.values());
    };
    BallastViewport.prototype.createRoot = function (host, id) {
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        host.appendChild(root);
        return root;
    };
    BallastViewport.prototype.createCanvas = function (root) {
        var canvas = root.ownerDocument.createElement('canvas');
        canvas.id = root.id + '_canvas';
        root.appendChild(canvas);
        return canvas;
    };
    BallastViewport.prototype.createRenderingContext = function (canvas) {
        var renderingContext = this.canvas.getContext('2d');
        if (!renderingContext) {
            throw new Error('Could not create rendering context from canvas');
        }
        return renderingContext;
    };
    BallastViewport.prototype.renderLoop = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.renderLoop(); });
        this.render();
    };
    BallastViewport.prototype.render = function () {
        var renderingSteps = this.getRenderingSteps();
        var i = renderingSteps.length;
        var next = this.postrender;
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
    return BallastViewport;
}());
exports.BallastViewport = BallastViewport;
//# sourceMappingURL=ballast-viewport.js.map