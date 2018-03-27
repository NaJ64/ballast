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
var TriangleProgram = /** @class */ (function (_super) {
    __extends(TriangleProgram, _super);
    function TriangleProgram(gl, vertexA, vertexB, vertexC, initialTranslation, initialRotation, initialScaling) {
        return _super.call(this, gl, { triangles: [{ vertices: [vertexA, vertexB, vertexC] }] }, initialTranslation, initialRotation, initialScaling) || this;
    }
    return TriangleProgram;
}(shape_2d_program_1.Shape2DProgram));
exports.TriangleProgram = TriangleProgram;
//# sourceMappingURL=triangle-program.js.map