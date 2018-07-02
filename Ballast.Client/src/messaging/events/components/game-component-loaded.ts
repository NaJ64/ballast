import { EventBase } from 'ballast-core';

export class GameComponentLoadedEvent extends EventBase {

    public static readonly id: string = 'GameComponentLoadedEvent';

    public get id() {
        return GameComponentLoadedEvent.id;
    }
    
}