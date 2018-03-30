export class BallastViewport {

    private readonly host: HTMLElement;
    private readonly root: HTMLDivElement;

    public constructor(host: HTMLElement, clientId: string) {
        this.host = host;
        this.root = this.createRoot(host, clientId);
    }

    private createRoot(host: HTMLElement, id: string): HTMLDivElement {
        if (host.style.height == null) {
            host.style.height = "800px";
        }
        if (host.style.width == null) {
            host.style.width = "450px";
        }
        var root = host.ownerDocument.createElement("div");
        root.id = id;
        host.appendChild(root);
        return root;
    }

    public getRoot(): HTMLDivElement {
        return this.root;
    }

}