export function createShader(gl : WebGLRenderingContext, type: number, source: string): WebGLShader {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success && shader) {
      return shader;
    }
    var shaderInfoLog = gl.getShaderInfoLog(shader) || "";
    console.log(shaderInfoLog);
    gl.deleteShader(shader);
    throw new Error(`Could not create shader--${shaderInfoLog}`);
}