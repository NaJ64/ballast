"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(state) {
        this.setState(state);
    }
    Player.prototype.setState = function (state) {
        this.id = state.id;
        this.name = state.name;
        return this;
    };
    Player.prototype.setTeam = function (team) {
        this.team = team;
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map