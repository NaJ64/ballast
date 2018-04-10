import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';

@injectable()
export class ChatComponent extends ComponentBase {

    protected render(parent: HTMLElement, renderingContext: RenderingContext) { }
    
}