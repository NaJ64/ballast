import { injectable } from 'inversify';
import { ViewBase } from './view-base';
import { ISignInView } from './abstractions';

@injectable()
export class SignInView extends ViewBase implements ISignInView {

    public hide() {
        throw new Error('Not implemented');
    }

    public show() {
        throw new Error('Not implemented');
    }

}