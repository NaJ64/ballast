import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';

@injectable()
export class ChatComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.ChatComponent;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }
    
}