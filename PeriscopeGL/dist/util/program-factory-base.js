"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var ProgramFactoryBase = /** @class */ (function () {
    function ProgramFactoryBase(gl, vsSource, fsSource) {
        this.gl = gl;
        this.vs = _1.createShader(gl, gl.VERTEX_SHADER, vsSource);
        this.fs = _1.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    }
    ProgramFactoryBase.prototype.CreateProgram = function () {
        return _1.createProgram(this.gl, this.vs, this.fs);
    };
    return ProgramFactoryBase;
}());
exports.ProgramFactoryBase = ProgramFactoryBase;
//# sourceMappingURL=program-factory-base.js.map