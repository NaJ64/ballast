"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var ProgramApiBase = /** @class */ (function () {
    function ProgramApiBase(gl, vsSource, fsSource) {
        this.gl = gl;
        this.vs = _1.createShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fs = _1.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        this.program = _1.createProgram(this.gl, this.vs, this.fs);
    }
    ProgramApiBase.prototype.getAttribute = function (attribute) {
        return this.gl.getAttribLocation(this.program, attribute);
    };
    ProgramApiBase.prototype.getUniform = function (uniform) {
        var location = this.gl.getUniformLocation(this.program, uniform);
        if (!location) {
            throw new Error('Error retrieving uniform location');
        }
        return location;
    };
    ProgramApiBase.prototype.clearAndResize = function () {
        this.clearCanvasTransparent();
        this.resizeViewportWithCanvas();
    };
    ProgramApiBase.prototype.resizeViewportWithCanvas = function () {
        _1.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    };
    ProgramApiBase.prototype.clearCanvasTransparent = function () {
        // Clear the canvas by setting the clear color to "transparent" then calling "gl.clear()"
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    ProgramApiBase.prototype.useCurrentProgram = function () {
        this.gl.useProgram(this.program);
    };
    ProgramApiBase.prototype.useNewCurrentBuffer = function () {
        // create a new buffer
        var buffer = this.gl.createBuffer();
        if (!buffer)
            throw new Error('Could not create position buffer');
        // Bind so all other gl functions refer to the new buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        return buffer;
    };
    ProgramApiBase.prototype.assign4fToUniform = function (uniform, f1, f2, f3, f4) {
        // set the resolution
        this.gl.uniform4f(uniform, f1, f2, f3, f4);
    };
    ProgramApiBase.prototype.assign2fToUniform = function (uniform, f1, f2) {
        // set the resolution
        this.gl.uniform2f(uniform, f1, f2);
    };
    ProgramApiBase.prototype.assignBufferToAttribute = function (buffer, attribute, instruction) {
        // activate the attribute
        this.gl.enableVertexAttribArray(attribute);
        // Bind the position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        // Instructions on how to read in attribute value(s) from the buffer
        var size = instruction.size; // components per iteration
        var type = instruction.type; // data type (32bit float / etc)
        var normalize = instruction.normalize; // normalize data flag (scale to 1)
        var stride = instruction.stride; // 0 = move forward (size * sizeof(type)) each iteration to get the next position
        var offset = instruction.offset; // start position within the buffer
        // Bind the attribute to the current buffer
        this.gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset);
    };
    ProgramApiBase.prototype.drawArrays = function (mode, offset, count) {
        this.gl.drawArrays(mode, offset, count);
    };
    return ProgramApiBase;
}());
exports.ProgramApiBase = ProgramApiBase;
//# sourceMappingURL=program-api-base.js.map