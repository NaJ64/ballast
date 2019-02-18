import { injectable } from "inversify";
import { RenderingComponentBase } from '../rendering-component';
import { IRenderingContext } from '../rendering-context';

@injectable()
export class SignInComponent extends RenderingComponentBase {
   
    protected onRender(renderingContext: IRenderingContext): void { 
        // No rendering component (currently) but in the future we may render a sign-in window
    }

}