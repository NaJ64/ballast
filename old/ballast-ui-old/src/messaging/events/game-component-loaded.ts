import { EventBase, IEvent } from 'ballast-core';

export interface IGameComponentLoadedEvent extends IEvent { }

export class GameComponentLoadedEvent extends EventBase {

    public static readonly id: string = 'GameComponentLoadedEvent';

    public get id() {
        return GameComponentLoadedEvent.id;
    }

    private constructor(state: IGameComponentLoadedEvent) {
        super(state.isoDateTime);
    }

    public static fromObject(object: IGameComponentLoadedEvent) {
        return new GameComponentLoadedEvent(object);
    }

    public static createNew() {
        return new GameComponentLoadedEvent({
            id: GameComponentLoadedEvent.id,
            isoDateTime: EventBase.getIsoDateTime()
        });
    }
    
}