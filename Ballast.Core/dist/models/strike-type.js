"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StrikeType = /** @class */ (function () {
    function StrikeType(data) {
        this.setState(data);
    }
    StrikeType.prototype.setState = function (data) {
        this.value = data.value;
        this.name = data.name;
        this.directImpactHP = data.directImpactHP;
        this.indirectImpactHP = data.indirectImpactHP;
        return this;
    };
    StrikeType.list = function () {
        return [
            StrikeType.Torpedo
        ];
    };
    StrikeType.fromValue = function (value) {
        if (!!value) {
            switch (value) {
                case (StrikeType.Torpedo.value):
                    return StrikeType.Torpedo;
            }
        }
        throw new Error("Could derive strike type from value (" + value + ")");
    };
    StrikeType.fromString = function (text) {
        if (!!text) {
            switch (text.toLocaleLowerCase()) {
                case (StrikeType.Torpedo.name.toLocaleLowerCase()):
                    return StrikeType.Torpedo;
            }
        }
        throw new Error("Could derive strike type from text/name (" + text + ")");
    };
    StrikeType.Torpedo = new StrikeType({ value: 0, name: 'Torpedo', directImpactHP: 100, indirectImpactHP: 50 });
    return StrikeType;
}());
exports.StrikeType = StrikeType;
//# sourceMappingURL=strike-type.js.map