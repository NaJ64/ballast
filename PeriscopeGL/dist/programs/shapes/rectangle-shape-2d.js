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
var transformable_shape_2d_1 = require("../transformable-shape-2d");
var RectangleShape2D = /** @class */ (function (_super) {
    __extends(RectangleShape2D, _super);
    function RectangleShape2D(gl, height, width, topLeftVertex, initialTranslation, initialRotation, initialScale) {
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
            ] }, initialTranslation, initialRotation, initialScale) || this;
        return _this;
    }
    return RectangleShape2D;
}(transformable_shape_2d_1.TransformableShape2D));
exports.RectangleShape2D = RectangleShape2D;
//# sourceMappingURL=rectangle-shape-2d.js.map