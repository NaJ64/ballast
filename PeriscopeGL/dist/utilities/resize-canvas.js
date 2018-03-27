"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resizeCanvas(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
exports.resizeCanvas = resizeCanvas;
//# sourceMappingURL=resize-canvas.js.map