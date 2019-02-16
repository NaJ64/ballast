export interface IBallastUiOptions {
    clientId: string | null;
    serverUrl: string | null;
}

export class BallastUiOptions implements IBallastUiOptions { 

    public clientId: string | null;
    public serverUrl: string | null;

    public constructor() {
        this.clientId = null;
        this.serverUrl = null;
    }
    
}