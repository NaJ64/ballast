import { injectable } from 'inversify';
import { ComponentBase } from './component-base';

@injectable()
export class SignInComponent extends ComponentBase {

    private static componentId: string = 'SignIn';

    protected getComponentId() {
        return SignInComponent.componentId;
    }

    protected render(parent: HTMLElement, renderingContext: CanvasRenderingContext2D) { }

}