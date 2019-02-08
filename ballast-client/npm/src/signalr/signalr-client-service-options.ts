export interface ISignalRClientServiceOptions {
    serverUrl: string;
    clientId: string;
}

export class SignalRClientServiceOptions implements ISignalRClientServiceOptions {
    public serverUrl: string;
    public clientId: string;
    public constructor(serverUrl: string, clientId: string) {
        this.serverUrl = serverUrl;
        this.clientId = clientId;
    }
}