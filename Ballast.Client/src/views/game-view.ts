import { injectable } from 'inversify';
import { ViewBase } from './view-base';
import { IGameView } from './abstractions/igame-view';
import { GameViewLoadedEvent } from '../messaging/events/views/game-view-loaded';

@injectable()
export class GameView extends ViewBase implements IGameView {

    protected canvas?: HTMLCanvasElement;

    public onAttach(host: HTMLElement) {
        this.canvas = this.createCanvas(host);
        let gameViewLoaded = new GameViewLoadedEvent();
        this.eventBus.publish(gameViewLoaded.eventId, gameViewLoaded);
    }

    private createCanvas(host: HTMLElement): HTMLCanvasElement {
        var canvas = host.ownerDocument.createElement("canvas");
        canvas.id = this.clientContext.clientId + '_game';
        canvas.style.display = 'none';
        host.appendChild(canvas);
        return canvas;
    }

    public show(): void {
        if (this.canvas) {
            this.canvas.style.display = null;
        }
    }

    public hide(): void {
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    }

}