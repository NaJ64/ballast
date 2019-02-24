import { injectable } from "inversify";
import { RenderingComponentBase } from "../rendering-component";

@injectable()
export class SignInComponent extends RenderingComponentBase {
   
    protected onRender(): void { 
        // No rendering component (currently) but in the future we may render a sign-in window
    }

}