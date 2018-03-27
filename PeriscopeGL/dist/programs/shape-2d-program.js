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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var m3 = __importStar(require("../utilities/matrix-3x3"));
var program_base_1 = require("./program-base");
var vs = "\n\n    attribute vec2 a_position;\n\n    uniform mat3 u_matrix;\n\n    void main() {\n\n        // Multiply the position by the matrix.\n        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);\n    \n    }\n\n";
var fs = "\n\n    precision mediump float;\n    uniform vec4 u_color;\n\n    void main() {\n        gl_FragColor = u_color;\n    }\n    \n";
var Shape2DProgram = /** @class */ (function (_super) {
    __extends(Shape2DProgram, _super);
    function Shape2DProgram(gl, shape, initialTranslation, initialRotation, initialScaling) {
        var _this = _super.call(this, gl, vs, fs) || this;
        _this.init(shape, initialTranslation, initialRotation, initialScaling);
        return _this;
    }
    Shape2DProgram.prototype.init = function (shape, initialTranslation, initialRotation, initialScaling, originOffset) {
        // Defaults
        if (!initialTranslation) {
            initialTranslation = { x: 0, y: 0 };
        }
        if (!initialRotation) {
            initialRotation = { radians: 0 };
        }
        if (!initialScaling) {
            initialScaling = { x: 1, y: 1 };
        }
        // Store initial state
        this.shape = shape;
        this.translation = this.initialTranslation = initialTranslation;
        this.rotation = this.initialRotation = initialRotation;
        this.scaling = this.initialScaling = initialScaling;
    };
    Shape2DProgram.prototype.reorient = function () {
        this.translation = this.initialTranslation;
        this.rotation = this.initialRotation;
        this.scaling = this.initialScaling;
    };
    Shape2DProgram.prototype.translate = function (translation) {
        this.translation.x = (this.translation.x || 0) + (translation.x || 0);
        this.translation.y = (this.translation.y || 0) + (translation.y || 0);
    };
    Shape2DProgram.prototype.rotate = function (rotation) {
        this.rotation.radians += rotation.radians;
    };
    Shape2DProgram.prototype.scale = function (scaling) {
        this.scaling.x = (this.scaling.x || 1) * (scaling.x || 1);
        this.scaling.y = (this.scaling.y || 1) * (scaling.y || 1);
    };
    Shape2DProgram.prototype.render = function () {
        // Flatten vertices
        var vertices = this.getVertices(this.shape);
        // apply current transformations to shape(s) using matrices
        var transformations = this.getTransformationMatrix();
        // set the current program for the gl context
        this.useCurrentProgram();
        // set uniform value(s) for transformation matrix
        this.assignMat3fToUniform(this.getMatrixUniform(), transformations);
        // set uniform value(s) for color
        this.assign4fToUniform(this.getColorUniform(), Math.random(), Math.random(), Math.random(), 1);
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
    Shape2DProgram.prototype.getTransformationMatrix = function () {
        // determine projection (resolution) matrix
        var projectionMatrix = m3.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        // compute matrices  
        var translationMatrix = m3.translation(this.translation.x || 0, this.translation.y || 0);
        var rotationMatrix = m3.rotation(this.rotation.radians);
        var scalingMatrix = m3.scaling(this.scaling.x || 1, this.scaling.y || 1);
        // multiply the matrices
        var matrix = m3.multiply(projectionMatrix, translationMatrix);
        matrix = m3.multiply(matrix, rotationMatrix);
        matrix = m3.multiply(matrix, scalingMatrix);
        // return the new transformation matrix
        return matrix;
    };
    Shape2DProgram.prototype.getVertices = function (shape) {
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
    Shape2DProgram.prototype.getPositionAttribute = function () {
        return this.getAttribute("a_position");
    };
    Shape2DProgram.prototype.getColorUniform = function () {
        return this.getUniform("u_color");
    };
    Shape2DProgram.prototype.getMatrixUniform = function () {
        return this.getUniform("u_matrix");
    };
    Shape2DProgram.prototype.loadDataIntoCurrentBuffer = function (data) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
    return Shape2DProgram;
}(program_base_1.ProgramBase));
exports.Shape2DProgram = Shape2DProgram;
//# sourceMappingURL=shape-2d-program.js.map