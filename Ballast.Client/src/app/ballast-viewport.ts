export class BallastViewport {

    private readonly host: HTMLElement;
    private readonly clientId: string;
    private readonly root: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;

    public constructor(host: HTMLElement, clientId: string) {
        this.host = host;
        this.clientId = clientId;
        this.root = this.createRoot(host);
        this.canvas = this.createCanvas(this.root);
    }

    private createRoot(host: HTMLElement):HTMLDivElement {
        var root = document.createElement("div");
        root.id = this.clientId;
        host.appendChild(root);
        return root;
    }

    private createCanvas(root: HTMLDivElement): HTMLCanvasElement {
        var canvas = document.createElement("canvas");
        canvas.id = this.clientId + '_canvas';
        root.appendChild(canvas);
        return canvas;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getClientId(): string {
        return this.clientId;
    }

}