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
    ProgramApiBase.prototype.resizeViewportWithCanvas = function () {
        _1.resizeCanvas(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    };
    ProgramApiBase.prototype.clearCanvasTransparent = function () {
        // Clear the canvas
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
    ProgramApiBase.prototype.setBufferForAttribute = function (buffer, attribute, instruction) {
        // activate the attribute
        this.gl.enableVertexAttribArray(attribute);
        // // Bind the position buffer
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        // Instructions on how to 
        var size = instruction.size; // 2 components per iteration
        var type = instruction.type; // the data is 32bit floats
        var normalize = instruction.normalize; // don't normalize the data
        var stride = instruction.stride; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = instruction.offset; // start at the beginning of the buffer
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