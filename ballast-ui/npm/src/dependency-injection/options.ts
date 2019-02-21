export interface IBallastUiOptions {
    host: HTMLElement | null;
    clientId: string | null;
    serverUrl: string | null;
}

export class BallastUiOptions implements IBallastUiOptions { 

    public host: HTMLElement | null;
    public clientId: string | null;
    public serverUrl: string | null;

    public constructor() {
        this.host = null;
        this.clientId = null;
        this.serverUrl = null;
    }
    
}