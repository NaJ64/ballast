import { injectable } from 'inversify';
import { ComponentBase } from './component-base';

@injectable()
export class ChatComponent extends ComponentBase {

    private static componentId: string = 'Chat';

    protected getComponentId() {
        return ChatComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }
    
}