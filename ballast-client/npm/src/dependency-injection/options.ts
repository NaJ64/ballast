export interface IBallastClientOptions {
    useSignalR: boolean;
}

export class BallastClientOptions implements IBallastClientOptions { 

    public useSignalR: boolean;

    public constructor() {
        this.useSignalR = true;
    }
    
}