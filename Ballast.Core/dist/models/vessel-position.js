"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var direction_1 = require("./direction");
var VesselPosition = /** @class */ (function () {
    function VesselPosition(state, vessel, allSpaces) {
        this.setState(state, vessel, allSpaces);
    }
    VesselPosition.prototype.setState = function (state, vessel, allSpaces) {
        // Set dates
        this.arrivalUtc = state.arrivalUtc || null;
        this.exitUtc = null;
        if (state.exitUtc) {
            this.exitUtc = state.exitUtc;
        }
        // Set vessel reference prop(s)
        this.vessel = vessel;
        // Set directions using constants
        this.arrivalDirection = direction_1.Direction.fromValue(state.arrivalDirection.value);
        this.exitDirection = (state.exitDirection && direction_1.Direction.fromValue(state.arrivalDirection.value)) || null;
        // Set board space reference prop
        var space = null;
        if (state.space) {
            var row_1 = state.space.coordinates.row;
            var column_1 = state.space.coordinates.column;
            space = allSpaces.find(function (x) { return row_1 == x.coordinates.row && column_1 == x.coordinates.column; }) || null;
        }
        if (!space) {
            throw new Error('Could not set vessel position due to invalid/unknown board coordinates');
        }
        this.space = space;
        return this;
    };
    VesselPosition.prototype.setNextAndPrevious = function (positions) {
        var _this = this;
        var foundIndex = positions.findIndex(function (x) { return x == _this; });
        if (foundIndex < 0) {
            return; // The current position is not in the collection
        }
        if (foundIndex > 0) {
            this.previous = positions[foundIndex - 1];
        }
        else {
            this.previous = null; // is current position
        }
        if (foundIndex < (positions.length - 1)) {
            this.next = positions[foundIndex + 1];
        }
        else {
            this.next = null; // is last position
        }
    };
    return VesselPosition;
}());
exports.VesselPosition = VesselPosition;
//# sourceMappingURL=vessel-position.js.map