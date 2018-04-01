"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var terrain_1 = require("./terrain");
var BoardSpace = /** @class */ (function () {
    function BoardSpace(data) {
        this.setState(data);
    }
    BoardSpace.prototype.setState = function (data) {
        this.coordinates = data.coordinates;
        this.terrain = terrain_1.Terrain.fromValue(data.terrain.value);
        return this;
    };
    BoardSpace.prototype.setAdjacents = function (boardSpaces) {
        // TODO:  Implement this lookup whereby the current space calculates adjacent spaces using the entire board
    };
    return BoardSpace;
}());
exports.BoardSpace = BoardSpace;
//# sourceMappingURL=board-space.js.map