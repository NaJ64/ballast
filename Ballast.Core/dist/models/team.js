"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vessel_1 = require("./vessel");
var Team = /** @class */ (function () {
    function Team(state, allPlayers, spaces) {
        this.setState(state, allPlayers, spaces);
    }
    Team.prototype.setState = function (state, allPlayers, spaces) {
        // Set primitives
        this.id = state.id;
        this.name = state.name;
        // Set player reference prop(s)
        this.players = [];
        var _loop_1 = function (playerData) {
            var player = allPlayers.find(function (x) { return x.id == playerData.id; }) || null;
            if (player) {
                this_1.players.push(player);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var playerData = _a[_i];
            _loop_1(playerData);
        }
        for (var _b = 0, _c = this.players; _b < _c.length; _b++) {
            var player = _c[_b];
            player.setTeam(this); // Set team reference for all players that were added
        }
        // Set vessel reference prop(s)
        this.vessels = [];
        for (var _d = 0, _e = state.vessels; _d < _e.length; _d++) {
            var vesselData = _e[_d];
            this.vessels.push(new vessel_1.Vessel(vesselData, this, spaces));
        }
        return this;
    };
    Team.prototype.setPlayers = function (players) {
        this.players = [];
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player = players_1[_i];
            this.players.push(player);
        }
    };
    return Team;
}());
exports.Team = Team;
//# sourceMappingURL=team.js.map