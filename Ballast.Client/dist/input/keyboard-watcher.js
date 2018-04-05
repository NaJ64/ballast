"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var KeyboardWatcher = /** @class */ (function () {
    function KeyboardWatcher(root) {
        var _this = this;
        this.root = root;
        this.pressedKeys = new Map();
        this.keydownListener = function (event) { return _this.pressedKeys.set(event.keyCode, new Date(Date.now())); };
        this.keyupListener = function (event) { return _this.pressedKeys.delete(event.keyCode); };
        this.addWindowEvents();
    }
    KeyboardWatcher.prototype.getWindow = function () {
        return this.root.ownerDocument.defaultView;
    };
    KeyboardWatcher.prototype.isDown = function (keyCode) {
        return !!this.pressedKeys.get(keyCode);
    };
    KeyboardWatcher.prototype.leftArrowIsDown = function () {
        return this.isDown(LEFT_ARROW);
    };
    KeyboardWatcher.prototype.upArrowIsDown = function () {
        return this.isDown(UP_ARROW);
    };
    KeyboardWatcher.prototype.rightArrowIsDown = function () {
        return this.isDown(RIGHT_ARROW);
    };
    KeyboardWatcher.prototype.downArrowIsDown = function () {
        return this.isDown(DOWN_ARROW);
    };
    KeyboardWatcher.prototype.addWindowEvents = function () {
        var currentWindow = this.getWindow();
        currentWindow.addEventListener('keydown', this.keydownListener, false);
        currentWindow.addEventListener('keyup', this.keyupListener, false);
    };
    KeyboardWatcher.prototype.dispose = function () {
        this.removeWindowEvents();
    };
    KeyboardWatcher.prototype.removeWindowEvents = function () {
        var currentWindow = this.getWindow();
        currentWindow.removeEventListener('keydown', this.keydownListener, false);
        currentWindow.removeEventListener('keyup', this.keyupListener, false);
    };
    return KeyboardWatcher;
}());
exports.KeyboardWatcher = KeyboardWatcher;
//# sourceMappingURL=keyboard-watcher.js.map