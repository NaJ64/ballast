"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var inversify_1 = require("inversify");
var types_1 = require("../ioc/types");
var component_base_1 = require("./component-base");
var game_component_loaded_1 = require("../messaging/events/components/game-component-loaded");
var GameComponent = /** @class */ (function (_super) {
    __extends(GameComponent, _super);
    function GameComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameComponent.prototype.getComponentId = function () {
        return types_1.TYPES_BALLAST.GameComponent;
    };
    GameComponent.prototype.render = function (parent, renderingContext) {
        if (!this.geometry) {
            this.geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        if (!this.material) {
            this.material = new THREE.MeshBasicMaterial({ color: 0x0000cc });
        }
        if (!this.cube) {
            this.cube = new THREE.Mesh(this.geometry, this.material);
        }
        if (renderingContext.keyboard.leftArrowIsDown()) {
            this.cube.position.x -= 0.1;
        }
        if (renderingContext.keyboard.rightArrowIsDown()) {
            this.cube.position.x += 0.1;
        }
        if (renderingContext.keyboard.downArrowIsDown()) {
            this.cube.position.y -= 0.1;
        }
        if (renderingContext.keyboard.upArrowIsDown()) {
            this.cube.position.y += 0.1;
        }
        // update rotation every time the object is rendered
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        if (renderingContext.threeScene) {
            renderingContext.threeScene.add(this.cube);
        }
        if (renderingContext.threePerspectiveCamera) {
            renderingContext.threePerspectiveCamera.position.z = 5;
        }
    };
    GameComponent.prototype.onAttach = function (parent) {
        var loadedEvent = new game_component_loaded_1.GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    };
    GameComponent = __decorate([
        inversify_1.injectable()
    ], GameComponent);
    return GameComponent;
}(component_base_1.ComponentBase));
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.js.map