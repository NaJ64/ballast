"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_space_1 = require("./board-space");
var board_type_1 = require("./board-type");
var Board = /** @class */ (function () {
    function Board(state) {
        this.setState(state);
    }
    Board.prototype.setState = function (state) {
        this.type = board_type_1.BoardType.fromValue(state.type.value);
        this.spaces = [];
        for (var _i = 0, _a = state.spaces; _i < _a.length; _i++) {
            var spaceData = _a[_i];
            this.spaces.push(new board_space_1.BoardSpace(spaceData));
        }
        var spaces = this.spaces.slice(0);
        for (var _b = 0, _c = this.spaces; _b < _c.length; _b++) {
            var space = _c[_b];
            space.setAdjacents(spaces);
        }
        for (var _d = 0, _e = state.spaces; _d < _e.length; _d++) {
            var space = _e[_d];
            this.spaces.push(new board_space_1.BoardSpace(space));
        }
        this.rows = this.groupRows(this.spaces);
        this.columns = this.groupColumns(this.spaces);
        return this;
    };
    Board.prototype.groupRows = function (spaces) {
        return spaces.reduce(function (rowGroups, nextSpace) {
            var groupKey = nextSpace.coordinates.row;
            if (!rowGroups || rowGroups.length < 1) {
                rowGroups.push([nextSpace]);
            }
            else {
                var existingGroup = rowGroups.find(function (group) {
                    return group[0].coordinates.row === (nextSpace.coordinates.row || "");
                });
                if (existingGroup) {
                    existingGroup.push(nextSpace);
                }
                else {
                    rowGroups.push([nextSpace]);
                }
            }
            return rowGroups;
        }, []);
    };
    Board.prototype.groupColumns = function (spaces) {
        return spaces.reduce(function (columnGroups, nextSpace) {
            var groupKey = nextSpace.coordinates.column;
            if (!columnGroups || columnGroups.length < 1) {
                columnGroups.push([nextSpace]);
            }
            else {
                var existingGroup = columnGroups.find(function (group) {
                    return group[0].coordinates.column === (nextSpace.coordinates.column || "");
                });
                if (existingGroup) {
                    existingGroup.push(nextSpace);
                }
                else {
                    columnGroups.push([nextSpace]);
                }
            }
            return columnGroups;
        }, []);
    };
    return Board;
}());
exports.Board = Board;
//# sourceMappingURL=board.js.map