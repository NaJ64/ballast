"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VesselType = /** @class */ (function () {
    function VesselType(state) {
        this.setState(state);
    }
    VesselType.prototype.setState = function (state) {
        this.value = state.value;
        this.name = state.name;
        this.baseHP = state.baseHP;
        this.canReverse = state.canReverse;
        return this;
    };
    VesselType.list = function () {
        return [
            VesselType.Submarine,
        ];
    };
    VesselType.fromValue = function (value) {
        if (!!value) {
            switch (value) {
                case (VesselType.Submarine.value):
                    return VesselType.Submarine;
            }
        }
        throw new Error("Could derive vessel type from value (" + value + ")");
    };
    VesselType.fromString = function (text) {
        if (!!text) {
            switch (text.toLocaleLowerCase()) {
                case (VesselType.Submarine.name.toLocaleLowerCase()):
                    return VesselType.Submarine;
            }
        }
        throw new Error("Could derive vessel type from text/name (" + text + ")");
    };
    VesselType.Submarine = new VesselType({ value: 0, name: 'Submarine', baseHP: 100, canReverse: false });
    return VesselType;
}());
exports.VesselType = VesselType;
//# sourceMappingURL=vessel-type.js.map