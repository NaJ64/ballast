import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';

@injectable()
export class GameComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.GameComponent;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) {
        renderingContext.font = "48px serif";
        renderingContext.fillText(new Date(Date.now()).toLocaleTimeString(), 10, 50);
    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}