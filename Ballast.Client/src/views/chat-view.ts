import { injectable } from 'inversify';
import { ViewBase } from './view-base';
import { IChatView } from './abstractions/ichat-view';

@injectable()
export class ChatView extends ViewBase implements IChatView {

    public hide() {
        throw new Error('Not implemented');
    }

    public show() {
        throw new Error('Not implemented');
    }

}