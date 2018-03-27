"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("../utilities");
var ProgramBase = /** @class */ (function () {
    function ProgramBase(gl, vsSource, fsSource) {
        this.gl = gl;
        this.vs = utilities_1.createShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fs = utilities_1.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        this.program = utilities_1.createProgram(this.gl, this.vs, this.fs);
    }
    ProgramBase.prototype.getAttribute = function (attribute) {
        return this.gl.getAttribLocation(this.program, attribute);
    };
    ProgramBase.prototype.getUniform = function (uniform) {
        var location = this.gl.getUniformLocation(this.program, uniform);
        if (!location) {
            throw new Error('Error retrieving uniform location');
        }
        return location;
    };
    ProgramBase.prototype.clearAndResize = function () {
        this.clearCanvasTransparent();
        this.resizeViewportWithCanvas();
    };
    ProgramBase.prototype.resizeViewportWithCanvas = function () {
        utilities_1.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    };
    ProgramBase.prototype.clearCanvasTransparent = function () {
        // Clear the canvas by setting the clear color to "transparent" then calling "gl.clear()"
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    ProgramBase.prototype.useCurrentProgram = function () {
        this.gl.useProgram(this.program);
    };
    ProgramBase.prototype.useNewCurrentBuffer = function () {
        // create a new buffer
        var buffer = this.gl.createBuffer();
        if (!buffer)
            throw new Error('Could not create position buffer');
        // Bind so all other gl functions refer to the new buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        return buffer;
    };
    ProgramBase.prototype.assignBufferToAttribute = function (buffer, attribute, instruction) {
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
    ProgramBase.prototype.assign2fToUniform = function (uniform, f1, f2) {
        // set the resolution
        this.gl.uniform2f(uniform, f1, f2);
    };
    ProgramBase.prototype.assign4fToUniform = function (uniform, f1, f2, f3, f4) {
        // set the resolution
        this.gl.uniform4f(uniform, f1, f2, f3, f4);
    };
    ProgramBase.prototype.assignMat3fToUniform = function (uniform, matrix) {
        // transpose = false
        this.gl.uniformMatrix3fv(uniform, false, matrix);
    };
    ProgramBase.prototype.drawArrays = function (mode, offset, count) {
        this.gl.drawArrays(mode, offset, count);
    };
    return ProgramBase;
}());
exports.ProgramBase = ProgramBase;
//# sourceMappingURL=program-base.js.map