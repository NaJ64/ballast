import { Guid } from "ballast-core";

export interface IBallastClientOptions {
    useSignalR: boolean;
    serverUrl: string | null;
    clientId: string | null;
}

export class BallastClientOptions implements IBallastClientOptions { 

    public useSignalR: boolean;
    public serverUrl: string | null;
    public clientId: string | null;

    public constructor() {
        this.useSignalR = true;
        this.serverUrl = null;
        this.clientId = Guid.newGuid();
    }
    
}