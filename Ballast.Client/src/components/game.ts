import { injectable } from 'inversify';
import { ComponentBase } from './component-base';
import { GameComponentLoadedEvent } from '../messaging/events/components/game-component-loaded';

@injectable()
export class GameComponent extends ComponentBase {

    private static componentId: string = 'Game';

    protected getComponentId() {
        return GameComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) {
        renderingContext.font = "48px serif";
        renderingContext.fillText('BALLAST!', 10, 50);
    }

    public onAttach(parent: HTMLElement) {
        let loadedEvent = new GameComponentLoadedEvent();
        this.eventBus.publish(loadedEvent.eventId, loadedEvent);
    }

}