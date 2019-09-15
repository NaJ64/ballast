import { IDisposable, IGameDto, IBoardDto, ITileDto } from "ballast-core";
import { IRenderer } from "./renderer";
import { IRenderingContext } from "./rendering-context";

interface IPoint {
    x: number;
    y: number;
}

export class Canvas2dRenderer implements IRenderer, IDisposable {

    private _isDisposed: boolean = false;
    private _canvasContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const canvasContext = canvas && canvas.getContext("2d");
        if (!canvas || !canvasContext) {
            throw new Error("Could not get 2d context from canvas argument");
        }
        this._canvasContext = canvasContext;
    }

    dispose() {
        delete this._canvasContext;
        this._isDisposed = true;
    }

    render(renderingContext: IRenderingContext) {
        if (this._isDisposed) {
            return;
        }
        if (!renderingContext.app.currentGame) {
            return;
        }
        this.draw(renderingContext.app.currentGame)
    }

    private getBounds(canvasContext: CanvasRenderingContext2D): IPoint {
        return {
            x: this._canvasContext.canvas.width,
            y: this._canvasContext.canvas.height
        };
    }

    private getOrigin(canvasContext: CanvasRenderingContext2D): IPoint {
        const bounds = this.getBounds(canvasContext);
        return {
            x: Math.floor(bounds.x / 2),
            y: Math.floor(bounds.y / 2)
        };
    }

    private draw(game: IGameDto) {
        this.clear();
        this.drawBoard(game.board);
    }

    private clear() {
        const ctx = this._canvasContext;
        const bounds = this.getBounds(ctx);
        ctx.clearRect(0, 0, bounds.x, bounds.y);
    }

    private drawBoard(board: IBoardDto) {
        const ctx = this._canvasContext;
        const bounds = this.getBounds(ctx);
        const origin = this.getOrigin(ctx);
        for(const tile of board.tiles) {
            this.drawTile(board, tile, bounds, origin);
        }
    }

    private drawTile(board: IBoardDto, tile: ITileDto, bounds: IPoint, origin: IPoint) {
        // use tile coordinates and bounds to place tile
        if (board.tileShape == "Square") {

        } else if (board.tileShape == "Octagon") {

        } else if (board.tileShape == "Hexagon") {

        } else { // Circle

        }
    }
 
}