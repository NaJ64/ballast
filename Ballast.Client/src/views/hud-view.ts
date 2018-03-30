import { injectable } from 'inversify';
import { ViewBase } from './view-base';
import { IHudView } from './abstractions';

@injectable()
export class HudView extends ViewBase implements IHudView {

    public hide() {
        throw new Error('Not implemented');
    }

    public show() {
        throw new Error('Not implemented');
    }

}