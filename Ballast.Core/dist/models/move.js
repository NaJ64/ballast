"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strike_1 = require("./strike");
var Move = /** @class */ (function () {
    function Move(state, teams) {
        this.setState(state, teams);
    }
    Move.prototype.setState = function (state, teams) {
        this.startUtc = state.startUtc;
        this.endUtc = state.endUtc || null;
        var team = teams.find(function (x) { return x.id == state.team.id; }) || null;
        if (!team) {
            throw new Error('Could not associate the current move with an existing team');
        }
        this.team = team;
        var player = this.team.players.find(function (x) { return x.id == state.player.id; }) || null;
        if (!player) {
            throw new Error('Could not associate the current move with an existing player');
        }
        this.player = player;
        var vessel = this.team.vessels.find(function (x) { return x.id == state.vessel.id; }) || null;
        if (!vessel) {
            throw new Error('Could not associate the current move with an existing vessel');
        }
        this.vessel = vessel;
        var fromPosition = this.vessel.positionHistory
            .find(function (x) { return x.space.coordinates.row == state.fromPosition.space.coordinates.row &&
            x.space.coordinates.column == state.fromPosition.space.coordinates.column &&
            x.arrivalUtc.valueOf() == state.fromPosition.arrivalUtc.valueOf(); }) || null;
        if (!fromPosition) {
            throw new Error('Could not associate the current move with a vessel position');
        }
        this.fromPosition = fromPosition;
        this.strike = state.strike && new strike_1.Strike(state.strike, this, teams) || null;
        return this;
    };
    return Move;
}());
exports.Move = Move;
//# sourceMappingURL=move.js.map