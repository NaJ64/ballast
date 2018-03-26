"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createProgram(gl, vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success && program) {
        return program;
    }
    var programInfoLog = gl.getProgramInfoLog(program) || "";
    console.log(programInfoLog);
    gl.deleteProgram(program);
    throw new Error("Error creating program--" + programInfoLog);
}
exports.createProgram = createProgram;
//# sourceMappingURL=create-program.js.map