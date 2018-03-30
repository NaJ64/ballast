import { ViewBase } from './view-base';
import { IGameView } from './abstractions/igame-view';
export declare class GameView extends ViewBase implements IGameView {
    protected canvas?: HTMLCanvasElement;
    onAttach(host: HTMLElement): void;
    private createCanvas(host);
    show(): void;
    hide(): void;
}
