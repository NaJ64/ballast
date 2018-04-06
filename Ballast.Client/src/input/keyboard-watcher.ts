import { BallastViewport } from '../app/ballast-viewport';
import { IDisposable } from '../interfaces/idisposable';
import { IEventBus } from '../messaging/ievent-bus';

const ENTER: number = 13;
const SHIFT: number = 16;
const LEFT_ARROW: number = 37;
const UP_ARROW: number = 38;
const RIGHT_ARROW: number = 39;
const DOWN_ARROW: number = 40;

type KeyboardEventListener = (event: KeyboardEvent) => any;

export class KeyboardWatcher implements IDisposable {

    private readonly root: HTMLDivElement;
    private readonly pressedKeys: Map<number, Date | undefined>;
    private readonly keydownListener: KeyboardEventListener;
    private readonly keyupListener: KeyboardEventListener;

    public constructor(root: HTMLDivElement) {
        this.root = root;
        this.pressedKeys = new Map<number, Date | undefined>();
        this.keydownListener = event => this.pressedKeys.set(event.keyCode, new Date(Date.now()));
        this.keyupListener = event => this.pressedKeys.delete(event.keyCode);
        this.addWindowEvents();
    }

    private getWindow() {
        return this.root.ownerDocument.defaultView;
    }

    public isDown(keyCode: number) {
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