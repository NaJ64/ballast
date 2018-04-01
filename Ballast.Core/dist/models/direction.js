"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction = /** @class */ (function () {
    function Direction(data) {
        this.setState(data);
    }
    Direction.prototype.setState = function (data) {
        this.value = data.value;
        this.name = data.name;
        return this;
    };
    Direction.list = function () {
        return [
            Direction.North,
            Direction.South,
            Direction.West,
            Direction.East,
            Direction.NorthWest,
            Direction.NorthEast,
            Direction.SouthWest,
            Direction.SouthEast
        ];
    };
    Direction.fromValue = function (value) {
        if (!!value) {
            switch (value) {
                case (Direction.North.value):
                    return Direction.North;
                case (Direction.South.value):
                    return Direction.South;
                case (Direction.West.value):
                    return Direction.West;
                case (Direction.East.value):
                    return Direction.East;
                case (Direction.NorthWest.value):
                    return Direction.NorthWest;
                case (Direction.NorthEast.value):
                    return Direction.NorthEast;
                case (Direction.SouthWest.value):
                    return Direction.SouthWest;
                case (Direction.SouthEast.value):
                    return Direction.SouthEast;
            }
        }
        throw new Error("Could derive direction from value (" + value + ")");
    };
    Direction.fromString = function (text) {
        if (!!text) {
            switch (text.toLocaleLowerCase()) {
                case (Direction.North.name.toLocaleLowerCase()):
                    return Direction.North;
                case (Direction.South.name.toLocaleLowerCase()):
                    return Direction.South;
                case (Direction.West.name.toLocaleLowerCase()):
                    return Direction.West;
                case (Direction.East.name.toLocaleLowerCase()):
                    return Direction.East;
                case (Direction.NorthWest.name.toLocaleLowerCase()):
                    return Direction.NorthWest;
                case (Direction.NorthEast.name.toLocaleLowerCase()):
                    return Direction.NorthEast;
                case (Direction.SouthWest.name.toLocaleLowerCase()):
                    return Direction.SouthWest;
                case (Direction.SouthEast.name.toLocaleLowerCase()):
                    return Direction.SouthEast;
            }
        }
        throw new Error("Could derive direction from text/name (" + text + ")");
    };
    Direction.North = new Direction({ value: 0, name: 'North', isCardinal: true });
    Direction.South = new Direction({ value: 1, name: 'South', isCardinal: true });
    Direction.West = new Direction({ value: 2, name: 'West', isCardinal: true });
    Direction.East = new Direction({ value: 3, name: 'East', isCardinal: true });
    Direction.NorthWest = new Direction({ value: 4, name: 'NorthWest', isCardinal: false });
    Direction.NorthEast = new Direction({ value: 5, name: 'NorthEast', isCardinal: false });
    Direction.SouthWest = new Direction({ value: 6, name: 'SouthWest', isCardinal: false });
    Direction.SouthEast = new Direction({ value: 7, name: 'SouthEast', isCardinal: false });
    return Direction;
}());
exports.Direction = Direction;
//# sourceMappingURL=direction.js.map