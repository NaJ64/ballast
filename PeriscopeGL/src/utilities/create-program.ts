export function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success && program) {
      return program;
    }
    let programInfoLog = gl.getProgramInfoLog(program) || "";
    console.log(programInfoLog);
    gl.deleteProgram(program);
    throw new Error(`Error creating program--${programInfoLog}`)
}