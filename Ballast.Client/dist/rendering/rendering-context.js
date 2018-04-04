"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var RenderingContext = /** @class */ (function () {
    function RenderingContext(canvas) {
        this.canvas = canvas;
        //this.canvas2dContext = this.create2dContext(canvas);
        this.threeWebGLRenderer = this.createRenderer(canvas);
        this.threeScene = this.createScene();
        this.threePerspectiveCamera = this.createCamera(canvas);
    }
    RenderingContext.prototype.create2dContext = function (canvas) {
        var canvas2dContext = canvas.getContext('2d');
        if (!canvas2dContext) {
            throw new Error('Could not create canvas 2d context');
        }
        return canvas2dContext;
    };
    RenderingContext.prototype.createRenderer = function (canvas) {
        return new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    };
    RenderingContext.prototype.createScene = function () {
        return new THREE.Scene();
    };
    RenderingContext.prototype.createCamera = function (canvas) {
        var aspect = canvas.clientWidth / canvas.clientHeight;
        return new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    };
    return RenderingContext;
}());
exports.RenderingContext = RenderingContext;
//# sourceMappingURL=rendering-context.js.map