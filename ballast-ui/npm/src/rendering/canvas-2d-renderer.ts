import { IDisposable, IGameDto, IBoardDto, ITileDto } from "ballast-core";
import { IRenderer } from "./renderer";
import { IRenderingContext } from "./rendering-context";
import { RenderingUtilities } from "./rendering-utilities";

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

    // private getOrigin(canvasContext: CanvasRenderingContext2D): IPoint {
    //     const bounds = this.getBounds(canvasContext);
    //     return {
    //         x: Math.floor(bounds.x / 2),
    //         y: Math.floor(bounds.y / 2)
    //     };
    // }

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
        //const origin = this.getOrigin(ctx);
        const min: IPoint = { x: 0, y:0 };
        const max: IPoint = { x: 0, y:0 };
        board.tiles.forEach(tile => {
            const {x, z} = RenderingUtilities.to3dCoordinates(
                tile.orderedTriple,
                board.doubleIncrement,
                board.applyHexRowScaling
            );
            const y = z; // z dimension in 3d is y for our flat board
            if (x < min.x) {
                min.x = x;
            }
            if (x > max.x) {
                max.x = x;
            }
            if (y < min.y) {
                min.y = y;
            }
            if (y > max.y) {
                max.y = y;
            }
        });
        let offsetX = 0;
        let offsetY = 0;
        if (min.x < 0) {
            offsetX = (0 - min.x);
        }
        if (min.y < 0) {
            offsetY = (0 - min.y);
        }
        min.x = min.x + offsetX;
        max.x = max.x + offsetX;
        min.y = min.y + offsetY;
        max.y = max.y + offsetY;
        const scalarX = bounds.x / max.x;
        const scalarY = bounds.y / max.y;
        const conversion = (tile: ITileDto) => {
            let {x, z} = RenderingUtilities.to3dCoordinates(
                tile.orderedTriple,
                board.doubleIncrement,
                board.applyHexRowScaling
            );
            x += offsetX;
            z += offsetY;
            const canvasX = x * scalarX;
            const canvasY = z * scalarY;
            return {
                x: canvasX,
                y: canvasY
            } as IPoint;
        }
        const tilesWithPoints: [ITileDto, IPoint][] = board.tiles.map(tile => [tile, conversion(tile)]);
        for(const item of tilesWithPoints) {
            this.drawTile(board, item["0"], item["1"]);
        }
    }

    private drawTile(board: IBoardDto, tile: ITileDto, canvasPoint: IPoint) {
        // use tile coordinates and bounds to place tile
        let fillStyle = "white";
        switch(tile.terrain) {
            case "Coast":
                fillStyle = "brown";
                break;
            case "Land":
                fillStyle = "green";
                break;
            case "Water":
                fillStyle = "blue";
                break;
        }
        this._canvasContext.fillStyle = fillStyle;
        this._canvasContext.fillText(String.fromCharCode(parseInt("25A0", 16)), canvasPoint.x, canvasPoint.y);
        if (board.tileShape == "Square") {
            
        } else if (board.tileShape == "Octagon") {

        } else if (board.tileShape == "Hexagon") {

        } else { // Circle

        }
    }
 
}