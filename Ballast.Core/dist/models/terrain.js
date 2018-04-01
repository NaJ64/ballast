"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Terrain = /** @class */ (function () {
    function Terrain(state) {
        this.setState(state);
    }
    Terrain.prototype.setState = function (state) {
        this.value = state.value;
        this.name = state.name;
        return this;
    };
    Terrain.list = function () {
        return [
            Terrain.Water,
            Terrain.DeepWater,
            Terrain.ShallowWater,
            Terrain.Coast,
            Terrain.Grass,
            Terrain.Forest,
            Terrain.Mountain
        ];
    };
    Terrain.fromValue = function (value) {
        if (!!value) {
            switch (value) {
                case (Terrain.Water.value):
                    return Terrain.Water;
                case (Terrain.DeepWater.value):
                    return Terrain.DeepWater;
                case (Terrain.ShallowWater.value):
                    return Terrain.ShallowWater;
                case (Terrain.Coast.value):
                    return Terrain.Coast;
                case (Terrain.Grass.value):
                    return Terrain.Grass;
                case (Terrain.Forest.value):
                    return Terrain.Forest;
                case (Terrain.Mountain.value):
                    return Terrain.Mountain;
            }
        }
        throw new Error("Could derive terrain from value (" + value + ")");
    };
    Terrain.fromString = function (text) {
        if (!!text) {
            switch (text.toLocaleLowerCase()) {
                case (Terrain.Water.name.toLocaleLowerCase()):
                    return Terrain.Water;
                case (Terrain.DeepWater.name.toLocaleLowerCase()):
                    return Terrain.DeepWater;
                case (Terrain.ShallowWater.name.toLocaleLowerCase()):
                    return Terrain.ShallowWater;
                case (Terrain.Coast.name.toLocaleLowerCase()):
                    return Terrain.Coast;
                case (Terrain.Grass.name.toLocaleLowerCase()):
                    return Terrain.Grass;
                case (Terrain.Forest.name.toLocaleLowerCase()):
                    return Terrain.Forest;
                case (Terrain.Mountain.name.toLocaleLowerCase()):
                    return Terrain.Mountain;
            }
        }
        throw new Error("Could derive terrain from text/name (" + text + ")");
    };
    Terrain.Water = new Terrain({ value: 0, name: 'Water' });
    Terrain.DeepWater = new Terrain({ value: 1, name: 'DeepWater' });
    Terrain.ShallowWater = new Terrain({ value: 2, name: 'ShallowWater' });
    Terrain.Coast = new Terrain({ value: 3, name: 'Coast' });
    Terrain.Grass = new Terrain({ value: 4, name: 'Grass' });
    Terrain.Forest = new Terrain({ value: 5, name: 'Forest' });
    Terrain.Mountain = new Terrain({ value: 6, name: 'Mountain' });
    return Terrain;
}());
exports.Terrain = Terrain;
//# sourceMappingURL=terrain.js.map