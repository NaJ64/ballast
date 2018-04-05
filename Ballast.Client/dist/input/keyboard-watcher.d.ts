import { IDisposable } from '../interfaces/idisposable';
export declare class KeyboardWatcher implements IDisposable {
    private readonly root;
    private readonly pressedKeys;
    private readonly keydownListener;
    private readonly keyupListener;
    constructor(root: HTMLDivElement);
    private getWindow();
    isDown(keyCode: number): boolean;
    leftArrowIsDown(): boolean;
    upArrowIsDown(): boolean;
    rightArrowIsDown(): boolean;
    downArrowIsDown(): boolean;
    private addWindowEvents();
    dispose(): void;
    private removeWindowEvents();
}
