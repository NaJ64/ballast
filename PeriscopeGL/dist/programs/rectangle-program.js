"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var shape_2d_program_1 = require("./shape-2d-program");
var RectangleProgram = /** @class */ (function (_super) {
    __extends(RectangleProgram, _super);
    function RectangleProgram(gl, height, width, topLeftVertex, initialTranslation, initialRotation, initialScaling) {
        var _this = this;
        if (!topLeftVertex) {
            topLeftVertex = { x: 0, y: 0 };
        }
        var topRightVertex = {
            x: topLeftVertex.x + width,
            y: topLeftVertex.y
        };
        var bottomLeftVertex = {
            x: topLeftVertex.x,
            y: topLeftVertex.y + height
        };
        var bottomRightVertex = {
            x: topLeftVertex.x + width,
            y: topLeftVertex.y + height
        };
        _this = _super.call(this, gl, { triangles: [
                { vertices: [topLeftVertex, topRightVertex, bottomLeftVertex] },
                { vertices: [bottomLeftVertex, topRightVertex, bottomRightVertex] }
            ] }, initialTranslation, initialRotation, initialScaling) || this;
        return _this;
    }
    return RectangleProgram;
}(shape_2d_program_1.Shape2DProgram));
exports.RectangleProgram = RectangleProgram;
//# sourceMappingURL=rectangle-program.js.map