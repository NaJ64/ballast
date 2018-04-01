"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("./board");
var player_1 = require("./player");
var team_1 = require("./team");
var move_1 = require("./move");
var Game = /** @class */ (function () {
    function Game(state) {
        this.setState(state);
    }
    Game.prototype.setState = function (state) {
        this.startUtc = state.startUtc || null;
        this.endUtc = state.endUtc || null;
        if (!state.board) {
            throw new Error('Cannot build the current game model without board data');
        }
        this.board = new board_1.Board(state.board);
        this.players = [];
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var playerData = _a[_i];
            this.players.push(new player_1.Player(playerData));
        }
        this.teams = [];
        for (var _b = 0, _c = state.teams; _b < _c.length; _b++) {
            var teamData = _c[_b];
            this.teams.push(new team_1.Team(teamData, this.players, this.board.spaces));
        }
        this.moves = [];
        for (var _d = 0, _e = state.moves; _d < _e.length; _d++) {
            var moveData = _e[_d];
            this.moves.push(new move_1.Move(moveData, this.teams));
        }
        return this;
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map