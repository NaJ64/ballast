import { ViewBase } from './view-base';
import { IHudView } from './abstractions/ihud-view';
export declare class HudView extends ViewBase implements IHudView {
    hide(): void;
    show(): void;
}
