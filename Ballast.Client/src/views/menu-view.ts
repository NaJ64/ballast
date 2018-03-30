import { injectable } from 'inversify';
import { ViewBase } from './view-base';
import { IMenuView } from './abstractions/imenu-view';

@injectable()
export class MenuView extends ViewBase implements IMenuView {

    public hide() {
        throw new Error('Not implemented');
    }

    public show() {
        throw new Error('Not implemented');
    }

}