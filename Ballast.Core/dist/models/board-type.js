"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoardType = /** @class */ (function () {
    function BoardType(state) {
        this.setState(state);
    }
    BoardType.prototype.setState = function (state) {
        this.value = state.value;
        this.name = state.name;
        return this;
    };
    BoardType.list = function () {
        return [
            BoardType.Square,
            BoardType.Octagon
        ];
    };
    BoardType.fromValue = function (value) {
        if (!!value) {
            switch (value) {
                case (BoardType.Square.value):
                    return BoardType.Square;
                case (BoardType.Octagon.value):
                    return BoardType.Octagon;
            }
        }
        throw new Error("Could derive board type from value (" + value + ")");
    };
    BoardType.fromString = function (text) {
        if (!!text) {
            switch (text.toLocaleLowerCase()) {
                case (BoardType.Square.name.toLocaleLowerCase()):
                    return BoardType.Square;
                case (BoardType.Octagon.name.toLocaleLowerCase()):
                    return BoardType.Octagon;
            }
        }
        throw new Error("Could derive board type from text/name (" + text + ")");
    };
    BoardType.Square = new BoardType({ value: 0, name: 'Square' });
    BoardType.Octagon = new BoardType({ value: 1, name: 'Octagon' });
    return BoardType;
}());
exports.BoardType = BoardType;
//# sourceMappingURL=board-type.js.map