export class BallastViewport {

    private readonly host: HTMLElement;
    private readonly root: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;

    public constructor(host: HTMLElement, clientId: string) {
        this.host = host;
        this.root = this.createRoot(host, clientId);
        this.canvas = this.createCanvas(this.root);
    }

    private createRoot(host: HTMLElement, id: string):HTMLDivElement {
        var root = document.createElement("div");
        root.id = id;
        host.appendChild(root);
        return root;
    }

    private createCanvas(root: HTMLDivElement): HTMLCanvasElement {
        var canvas = document.createElement("canvas");
        canvas.id = this.root.id + '_canvas';
        root.appendChild(canvas);
        return canvas;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

}