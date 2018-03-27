"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var program_base_1 = require("./program-base");
var vs = "\n\n    attribute vec2 a_position;\n    uniform vec2 u_resolution;\n\n    void main() {\n\n        // convert the position from pixels to 0.0 to 1.0\n        vec2 zeroToOne = a_position / u_resolution;\n     \n        // convert from 0->1 to 0->2\n        vec2 zeroToTwo = zeroToOne * 2.0;\n     \n        // convert from 0->2 to -1->+1 (clipspace)\n        vec2 clipSpace = zeroToTwo - 1.0;\n     \n        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n    }\n\n";
var fs = "\n\n    precision mediump float;\n    uniform vec4 u_color;\n\n    void main() {\n        gl_FragColor = u_color;\n    }\n    \n";
var TransformableShape2D = /** @class */ (function (_super) {
    __extends(TransformableShape2D, _super);
    function TransformableShape2D(gl, shape, initialTranslation, initialRotation, initialScale) {
        var _this = _super.call(this, gl, vs, fs) || this;
        _this.init(shape, initialTranslation, initialRotation, initialScale);
        return _this;
    }
    TransformableShape2D.prototype.init = function (shape, initialTranslation, initialRotation, initialScale) {
        // Defaults
        if (!initialTranslation) {
            initialTranslation = { x: 0, y: 0 };
        }
        if (!initialRotation) {
            initialRotation = { radians: 0 };
        }
        if (!initialScale) {
            initialScale = { x: 1, y: 1 };
        }
        // Store initial state
        this.shape = shape;
        this.translation = this.initialTranslation = initialTranslation;
        this.rotation = this.initialRotation = initialRotation;
        this.scale = this.initialScale = initialScale;
    };
    TransformableShape2D.prototype.reorient = function () {
        this.translation = this.initialTranslation;
        this.rotation = this.initialRotation;
        this.scale = this.initialScale;
    };
    TransformableShape2D.prototype.translate = function (translation) {
        this.translation.x += translation.x;
        this.translation.y += translation.y;
    };
    TransformableShape2D.prototype.rotate = function (rotation) {
        this.rotation.radians += rotation.radians;
    };
    TransformableShape2D.prototype.rescale = function (scale) {
        this.scale.x += scale.x;
        this.scale.y += scale.y;
    };
    TransformableShape2D.prototype.render = function () {
        // apply current transformations to shape(s) using matrices
        var transformedShape = this.applyTransformations(this.shape);
        // Flatten vertices
        var vertices = this.getVertices(transformedShape);
        // set the current program for the gl context
        this.useCurrentProgram();
        // set uniform value(s) for color
        var colorUniform = this.getColorUniform();
        this.assign4fToUniform(colorUniform, Math.random(), Math.random(), Math.random(), 1);
        // set uniform value(s) for resolution
        var resolutionUniform = this.getResolutionUniform();
        this.assign2fToUniform(resolutionUniform, this.gl.canvas.width, this.gl.canvas.height);
        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();
        // load point data into the current buffer
        this.loadDataIntoCurrentBuffer(vertices);
        // get location of our vertex attribute
        var positionAttribute = this.getPositionAttribute();
        // map our buffer (data) to the position attribute on the shader (with instruction)
        this.assignBufferToAttribute(buffer, positionAttribute, {
            size: 2,
            type: this.gl.FLOAT,
            normalize: false,
            stride: 0,
            offset: 0 // start at the beginning of the buffer
        });
        // determine the number of times to draw (based on number of points)
        var count = Math.floor(vertices.length / 2);
        // draw using mode "TRIANGLES"
        this.drawArrays(this.gl.TRIANGLES, 0, count);
    };
    TransformableShape2D.prototype.applyTransformations = function (shape) {
        return shape;
    };
    TransformableShape2D.prototype.getVertices = function (shape) {
        // Flatten vertices
        var vertices = [];
        for (var i = 0; i < shape.triangles.length; i++) {
            var triangle = shape.triangles[i];
            for (var j = 0; j < triangle.vertices.length; j++) {
                var vertex = triangle.vertices[j];
                var x = vertex.x;
                var y = vertex.y;
                vertices.push(x);
                vertices.push(y);
            }
        }
        return vertices;
    };
    TransformableShape2D.prototype.getPositionAttribute = function () {
        return this.getAttribute("a_position");
    };
    TransformableShape2D.prototype.getColorUniform = function () {
        return this.getUniform("u_color");
    };
    TransformableShape2D.prototype.getResolutionUniform = function () {
        return this.getUniform("u_resolution");
    };
    TransformableShape2D.prototype.loadDataIntoCurrentBuffer = function (data) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
    return TransformableShape2D;
}(program_base_1.ProgramBase));
exports.TransformableShape2D = TransformableShape2D;
//# sourceMappingURL=transformable-shape-2d.js.map