export interface IBallastCoreOptions {
    useDomain: boolean;
    useLocalEventBus: boolean;
}

export class BallastCoreOptions implements IBallastCoreOptions { 

    public useDomain: boolean;
    public useLocalEventBus: boolean;

    public constructor() {
        this.useDomain = true;
        this.useLocalEventBus = true;
    }
    
}