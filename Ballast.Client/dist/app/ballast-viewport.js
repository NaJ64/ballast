"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BallastViewport = /** @class */ (function () {
    function BallastViewport(host, clientId) {
        var _this = this;
        this.prerender = function (renderingContext) {
            // initial render step goes here
            _this.resizeCanvas(renderingContext.canvas);
            renderingContext.clearRect(0, 0, renderingContext.canvas.clientWidth, renderingContext.canvas.clientHeight);
        };
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
        root.style.height = '100%';
        root.style.width = '100%';
        host.appendChild(root);
        return root;
    };
    BallastViewport.prototype.createCanvas = function (root) {
        var canvas = root.ownerDocument.createElement('canvas');
        canvas.id = root.id + '_canvas';
        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
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
        requestAnimationFrame(function () { return _this.renderLoop(); });
        this.render();
    };
    BallastViewport.prototype.render = function () {
        var renderingSteps = this.getRenderingSteps();
        var i = renderingSteps.length;
        var next = this.postrender;
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
    return BallastViewport;
}());
exports.BallastViewport = BallastViewport;
//# sourceMappingURL=ballast-viewport.js.map