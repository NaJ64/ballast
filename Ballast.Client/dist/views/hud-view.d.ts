import { ViewBase } from './view-base';
import { IHudView } from './abstractions';
export declare class HudView extends ViewBase implements IHudView {
    hide(): void;
    show(): void;
}
