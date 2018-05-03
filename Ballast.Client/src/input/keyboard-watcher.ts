import { BallastViewport } from '../app/ballast-viewport';
import { IDisposable } from 'ballast-core';
import { IEventBus } from 'ballast-core';

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

    private readonly root: HTMLDivElement;
    private readonly pressedKeys: Map<number, Date | undefined>;
    private readonly keydownListener: KeyboardEventListener;
    private readonly keyupListener: KeyboardEventListener;
    private isSuspended: boolean;

    public constructor(root: HTMLDivElement) {
        this.root = root;
        this.pressedKeys = new Map<number, Date | undefined>();
        this.keydownListener = event => this.pressedKeys.set(event.keyCode, new Date(Date.now()));
        this.keyupListener = event => this.pressedKeys.delete(event.keyCode);
        this.addWindowEvents();
        this.isSuspended = false;
    }

    public suspend() {
        this.isSuspended = true;
    }

    public resume() {
        this.isSuspended = false;
    }

    private getWindow() {
        return this.root.ownerDocument.defaultView;
    }

    public isDown(keyCode: number) {
        if (this.isSuspended)
            return false;
        return !!this.pressedKeys.get(keyCode);
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
        currentWindow.addEventListener('keydown', this.keydownListener, false);
        currentWindow.addEventListener('keyup', this.keyupListener, false);
    }

    public dispose() {
        this.removeWindowEvents();
    }

    private removeWindowEvents() {
        let currentWindow = this.getWindow();
        currentWindow.removeEventListener('keydown', this.keydownListener,  false);
        currentWindow.removeEventListener('keyup', this.keyupListener,  false);
    }
    
}