"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vessel_position_1 = require("./vessel-position");
var vessel_type_1 = require("./vessel-type");
var Vessel = /** @class */ (function () {
    function Vessel(state, team, spaces) {
        this.setState(state, team, spaces);
    }
    Vessel.prototype.setState = function (state, team, spaces) {
        // Set primitives
        this.id = state.id;
        this.active = state.active;
        this.remainingHP = state.remainingHP;
        this.kills = state.kills;
        // Set vessel type from const with matching value
        this.vesselType = vessel_type_1.VesselType.fromValue(state.vesselType.value);
        // Set team reference prop
        this.team = team || null;
        // Set captain (player) reference prop
        this.captain = null;
        if (state.captain && team.players) {
            var captainData_1 = state.captain;
            this.captain = team.players.find(function (x) { return x.id == captainData_1.id; }) || null;
        }
        // Set radioman (player) reference prop
        this.radioman = null;
        if (state.radioman && team.players) {
            var radiomanData_1 = state.radioman;
            this.radioman = team.players.find(function (x) { return x.id == radiomanData_1.id; }) || null;
        }
        // Set positions history
        this.positionHistory = [];
        var sortedPositionData = state.positionHistory
            .sort(function (a, b) { return b.arrivalUtc.valueOf() - a.arrivalUtc.valueOf(); });
        for (var _i = 0, sortedPositionData_1 = sortedPositionData; _i < sortedPositionData_1.length; _i++) {
            var positionData = sortedPositionData_1[_i];
            this.positionHistory.push(new vessel_position_1.VesselPosition(positionData, this, spaces));
        }
        // Set previous/next positions within list
        for (var _a = 0, _b = this.positionHistory; _a < _b.length; _a++) {
            var position = _b[_a];
            position.setNextAndPrevious(this.positionHistory);
        }
        return this;
    };
    return Vessel;
}());
exports.Vessel = Vessel;
//# sourceMappingURL=vessel.js.map