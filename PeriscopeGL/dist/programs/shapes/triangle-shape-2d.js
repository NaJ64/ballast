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
var TriangleShape2D = /** @class */ (function (_super) {
    __extends(TriangleShape2D, _super);
    function TriangleShape2D(gl, vertexA, vertexB, vertexC, initialTranslation, initialRotation, initialScale) {
        return _super.call(this, gl, { triangles: [{ vertices: [vertexA, vertexB, vertexC] }] }, initialTranslation, initialRotation, initialScale) || this;
    }
    return TriangleShape2D;
}(transformable_shape_2d_1.TransformableShape2D));
exports.TriangleShape2D = TriangleShape2D;
//# sourceMappingURL=triangle-shape-2d.js.map