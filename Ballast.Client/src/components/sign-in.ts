import { injectable } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';

@injectable()
export class SignInComponent extends ComponentBase {

    protected getComponentId() {
        return TYPES_BALLAST.SignInComponent;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }

}