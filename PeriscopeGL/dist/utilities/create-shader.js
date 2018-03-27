"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success && shader) {
        return shader;
    }
    var shaderInfoLog = gl.getShaderInfoLog(shader) || "";
    console.log(shaderInfoLog);
    gl.deleteShader(shader);
    throw new Error("Could not create shader--" + shaderInfoLog);
}
exports.createShader = createShader;
//# sourceMappingURL=create-shader.js.map