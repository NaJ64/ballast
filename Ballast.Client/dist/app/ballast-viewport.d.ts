export declare class BallastViewport {
    private readonly host;
    private readonly root;
    constructor(host: HTMLElement, clientId: string);
    private createRoot(host, id);
    getRoot(): HTMLDivElement;
}
