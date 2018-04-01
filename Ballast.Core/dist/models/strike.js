"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Strike = /** @class */ (function () {
    function Strike(state, move, teams) {
        this.setState(state, move, teams);
    }
    Strike.prototype.setState = function (state, move, teams) {
        this.startUtc = state.startUtc;
        this.endUtc = state.endUtc || null;
        this.totalDamageHP = state.totalDamageHP;
        this.move = move;
        var allVessels = this.getVessels(teams);
        var source = allVessels.find(function (x) { return x.id == state.source.id; });
        if (!source) {
            throw new Error('Could not associate the current strike with an existing source vessel');
        }
        this.source = source;
        this.affected = [];
        var _loop_1 = function (vesselData) {
            var vessel = allVessels.find(function (x) { return x.id == vesselData.id; }) || null;
            if (!vessel) {
                throw new Error('Could not associate the current strike with one (or more) affected vessel(s)');
            }
            this_1.affected.push(vessel);
        };
        var this_1 = this;
        for (var _i = 0, _a = state.affected; _i < _a.length; _i++) {
            var vesselData = _a[_i];
            _loop_1(vesselData);
        }
        return this;
    };
    Strike.prototype.getVessels = function (teams) {
        return teams.reduce(function (allVessels, nextTeam) {
            for (var _i = 0, _a = nextTeam.vessels; _i < _a.length; _i++) {
                var teamVessel = _a[_i];
                allVessels.push(teamVessel);
            }
            return allVessels;
        }, []);
    };
    return Strike;
}());
exports.Strike = Strike;
//# sourceMappingURL=strike.js.map