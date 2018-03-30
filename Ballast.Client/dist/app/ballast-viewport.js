"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BallastViewport = /** @class */ (function () {
    function BallastViewport(host, clientId) {
        this.host = host;
        this.root = this.createRoot(host, clientId);
    }
    BallastViewport.prototype.createRoot = function (host, id) {
        if (host.style.height == null) {
            host.style.height = "800px";
        }
        if (host.style.width == null) {
            host.style.width = "450px";
        }
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        host.appendChild(root);
        return root;
    };
    BallastViewport.prototype.getRoot = function () {
        return this.root;
    };
    return BallastViewport;
}());
exports.BallastViewport = BallastViewport;
//# sourceMappingURL=ballast-viewport.js.map