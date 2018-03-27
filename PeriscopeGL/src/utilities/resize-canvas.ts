export function resizeCanvas(canvas: HTMLCanvasElement) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth || 
        canvas.height != displayHeight) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
}