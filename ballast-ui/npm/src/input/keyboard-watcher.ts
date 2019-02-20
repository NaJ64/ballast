import { IDisposable } from "ballast-core";

const ENTER: number = 13;
const SHIFT: number = 16;
const LEFT_ARROW: number = 37;
const UP_ARROW: number = 38;
const RIGHT_ARROW: number = 39;
const DOWN_ARROW: number = 40;
const W: number = 87;
const A: number = 65;
const S: number = 83;
const D: number = 68;
const T: number = 84;

type KeyboardEventListener = (event: KeyboardEvent) => any;

export class KeyboardWatcher implements IDisposable {

    private readonly _root: HTMLDivElement;
    private readonly _pressedKeys: Map<number, Date | undefined>;
    private readonly _keydownListener: KeyboardEventListener;
    private readonly _keyupListener: KeyboardEventListener;
    private _isSuspended: boolean;

    public constructor(root: HTMLDivElement) {
        this._root = root;
        this._pressedKeys = new Map<number, Date | undefined>();
        this._keydownListener = event => this._pressedKeys.set(event.keyCode, new Date(Date.now()));
        this._keyupListener = event => this._pressedKeys.delete(event.keyCode);
        this.addWindowEvents();
        this._isSuspended = false;
    }

    public dispose() {
        this.removeWindowEvents();
    }

    public suspend() {
        this._isSuspended = true;
    }

    public resume() {
        this._isSuspended = false;
    }

    private getWindow() {
        return this._root.ownerDocument!.defaultView!;
    }

    public isDown(keyCode: number) {
        if (this._isSuspended)
            return false;
        return !!this._pressedKeys.get(keyCode);
    }

    public enterIsDown() {
        return this.isDown(ENTER);
    }

    public shiftIsDown() {
        return this.isDown(SHIFT);
    }

    public leftArrowIsDown() {
        return this.isDown(LEFT_ARROW);
    }

    public upArrowIsDown() {
        return this.isDown(UP_ARROW);
    }

    public rightArrowIsDown() {
        return this.isDown(RIGHT_ARROW);
    }

    public downArrowIsDown() {
        return this.isDown(DOWN_ARROW);
    }

    public wIsDown() {
        return this.isDown(W);
    }

    public aIsDown() {
        return this.isDown(A);
    }

    public sIsDown() {
        return this.isDown(S);
    }

    public dIsDown() {
        return this.isDown(D);
    }

    public tIsDown() {
        return this.isDown(T);
    }

    private addWindowEvents() {
        let currentWindow = this.getWindow();
        currentWindow.addEventListener('keydown', this._keydownListener, false);
        currentWindow.addEventListener('keyup', this._keyupListener, false);
    }

    private removeWindowEvents() {
        let currentWindow = this.getWindow();
        currentWindow.removeEventListener('keydown', this._keydownListener,  false);
        currentWindow.removeEventListener('keyup', this._keyupListener,  false);
    }
    
}