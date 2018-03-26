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
var util_1 = require("../util");
var vs = "\n    attribute vec4 a_position;\n    void main() {\n        gl_Position = a_position;\n    }\n";
var fs = "\n    precision mediump float;\n    void main() {\n        gl_FragColor = vec4(1, 0, 0.5, 1);\n    }\n";
var TestProgramFactory = /** @class */ (function (_super) {
    __extends(TestProgramFactory, _super);
    function TestProgramFactory(gl) {
        return _super.call(this, gl, vs, fs) || this;
    }
    return TestProgramFactory;
}(util_1.ProgramFactoryBase));
exports.TestProgramFactory = TestProgramFactory;
//# sourceMappingURL=test-program.js.map