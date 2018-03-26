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
var util_1 = require("../util");
var vs = "\n    attribute vec2 a_position;\n    uniform vec2 u_resolution;\n\n    void main() {\n\n        // convert the position from pixels to 0.0 to 1.0\n        vec2 zeroToOne = a_position / u_resolution;\n     \n        // convert from 0->1 to 0->2\n        vec2 zeroToTwo = zeroToOne * 2.0;\n     \n        // convert from 0->2 to -1->+1 (clipspace)\n        vec2 clipSpace = zeroToTwo - 1.0;\n     \n        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n    }\n";
var fs = "\n    precision mediump float;\n    uniform vec4 u_color;\n\n    void main() {\n        gl_FragColor = u_color;\n    }\n";
var RectangleProgram = /** @class */ (function (_super) {
    __extends(RectangleProgram, _super);
    function RectangleProgram(gl) {
        return _super.call(this, gl, vs, fs) || this;
    }
    RectangleProgram.prototype.render = function (topLeft, widthPixels, heightPixels, color) {
        if (!color) {
            color = { r: Math.random(), g: Math.random(), b: Math.random(), a: Math.random() };
        }
        if (!color.a) {
            color.a = 1;
        }
        // Convert dimensions to 2 arrays of vertices (two halfs of rectangle)
        var data = [
            topLeft.xPixels, topLeft.yPixels,
            (topLeft.xPixels + widthPixels), topLeft.yPixels,
            topLeft.xPixels, (topLeft.yPixels + heightPixels),
            (topLeft.xPixels + widthPixels), (topLeft.yPixels + heightPixels),
            (topLeft.xPixels + widthPixels), topLeft.yPixels,
            topLeft.xPixels, (topLeft.yPixels + heightPixels)
        ];
        // set the current program for the gl context
        this.useCurrentProgram();
        // set uniform value(s) for color
        var colorUniform = this.getColorUniform();
        this.assign4fToUniform(colorUniform, color.r, color.g, color.b, color.a);
        // set uniform value(s) for resolution
        var resolutionUniform = this.getResolutionUniform();
        this.assign2fToUniform(resolutionUniform, this.gl.canvas.width, this.gl.canvas.height);
        // create new buffer in which to place our point data
        var buffer = this.useNewCurrentBuffer();
        // load point data into the current buffer
        this.loadDataIntoCurrentBuffer(data);
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
        var count = Math.floor(data.length / 2);
        // draw using mode "TRIANGLES"
        this.drawArrays(this.gl.TRIANGLES, 0, count);
    };
    RectangleProgram.prototype.loadDataIntoCurrentBuffer = function (data) {
        // load data into the current buffer (positionBuffer) with static draw usage
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    };
    RectangleProgram.prototype.getPositionAttribute = function () {
        // locate using name of attribute
        return this.getAttribute('a_position');
    };
    RectangleProgram.prototype.getResolutionUniform = function () {
        return this.getUniform("u_resolution");
    };
    RectangleProgram.prototype.getColorUniform = function () {
        return this.getUniform("u_color");
    };
    return RectangleProgram;
}(util_1.ProgramApiBase));
exports.RectangleProgram = RectangleProgram;
//# sourceMappingURL=rectangle-program.js.map