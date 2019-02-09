export interface ISignalRClientOptions {
    serverUrl: string;
    clientId: string;
}

export class SignalRClientOptions implements ISignalRClientOptions {
    public serverUrl: string;
    public clientId: string;
    public constructor(serverUrl: string, clientId: string) {
        this.serverUrl = serverUrl;
        this.clientId = clientId;
    }
}