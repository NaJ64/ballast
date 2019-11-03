import { IBoardDto, IDisposable, ITileDto, IVesselDto } from "ballast-core";
import { IBallastAppState } from "../app-state";
import { IRenderer } from "./renderer";
import { RenderingConstants } from "./rendering-constants";
import { IRenderingContext } from "./rendering-context";
import { RenderingUtilities } from "./rendering-utilities";

interface IPoint {
    x: number;
    y: number;
}

export class Canvas2dRenderer implements IRenderer, IDisposable {

    private _renderingContext?: IRenderingContext;
    private _isDisposed: boolean = false;
    private _canvasContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const canvasContext = canvas && canvas.getContext("2d");
        if (!canvas || !canvasContext) {
            throw new Error("Could not get 2d context from canvas argument");
        }
        this._canvasContext = canvasContext;
        this.onDisplayCanvasResize = this.onDisplayCanvasResize.bind(this);
        ((this._canvasContext.canvas.ownerDocument as Document)
            .defaultView as Window)
            .addEventListener("resize", this.onDisplayCanvasResize);
    }

    dispose() {
        ((this._canvasContext.canvas.ownerDocument as Document)
            .defaultView as Window)
            .removeEventListener("resize", this.onDisplayCanvasResize);
        delete this._canvasContext;
        this._isDisposed = true;
    }

    private onDisplayCanvasResize() {
        this._renderingContext && this.render(this._renderingContext);
    }

    render(renderingContext: IRenderingContext) {
        if (this._isDisposed) {
            return;
        }
        this._renderingContext = renderingContext;
        // Resize display canvas
        const displayCanvas = this._canvasContext.canvas;
        const displayComputedStyle = ((this._canvasContext.canvas.ownerDocument as Document).defaultView as Window)
            .getComputedStyle(displayCanvas);
        const displayCanvasHeight = parseInt(displayComputedStyle.height as string);
        const displayCanvasWidth = parseInt(displayComputedStyle.width as string);
        if (displayCanvasHeight != displayCanvas.height) {
            displayCanvas.height = displayCanvasHeight;
        }
        if (displayCanvasWidth != displayCanvas.width) {
            displayCanvas.width = displayCanvasWidth;
        }
        // Render/clear game state onto internal canvas
        if (renderingContext.app.currentGame) {
            this.draw(renderingContext.app);
        } else {
            this.clear();
        }
        // Draw internal canvas onto display canvas
        //this._displayCanvasCtx.drawImage(this._internalCanvasCtx.canvas, 0, 0);
    }

    private getBounds(canvasContext: CanvasRenderingContext2D): IPoint {
        return {
            x: canvasContext.canvas.width,
            y: canvasContext.canvas.height
        };
    }

    // private getOrigin(canvasContext: CanvasRenderingContext2D): IPoint {
    //     const bounds = this.getBounds(canvasContext);
    //     return {
    //         x: Math.floor(bounds.x / 2),
    //         y: Math.floor(bounds.y / 2)
    //     };
    // }

    private draw(app: IBallastAppState) {
        this.clear();
        app.currentGame && this.drawBoard(app.currentGame.board, app.currentVessel || null);
    }

    private clear() {
        const ctx = this._canvasContext;
        const bounds = this.getBounds(ctx);
        ctx.clearRect(0, 0, bounds.x, bounds.y);
    }

    private drawBoard(board: IBoardDto, currentVessel: IVesselDto | null) {
        const ctx = this._canvasContext;
        const bounds = this.getBounds(ctx);
        if (board.applyHexRowScaling) {
            bounds.y = RenderingConstants.HEX_ROW_SCALAR * bounds.y;
        }
        //const origin = this.getOrigin(ctx);
        const min: IPoint = { x: 0, y: 0 };
        const max: IPoint = { x: 0, y: 0 };
        const rows: Record<string, number> = {};
        const cols: Record<string, number> = {};
        board.tiles.forEach(tile => {
            const {x, z} = RenderingUtilities.to3dCoordinates(
                tile.orderedTriple,
                board.doubleIncrement,
                board.applyHexRowScaling
            );
            const y = z; // z dimension in 3d is y for our flat board
            rows[x.toString()] = (rows[x.toString()] || 0) + 1;
            cols[y.toString()] = (cols[y.toString()] || 0) + 1;
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

        let maxPer = 0;
        Object.keys(rows).forEach(row => {
            if (rows[row] > maxPer) {
                maxPer = rows[row];
            }
        });
        Object.keys(cols).forEach(col => {
            if (cols[col] > maxPer) {
                maxPer = cols[col];
            }
        });
        const radius = 0.5 * (bounds.x > bounds.y ? bounds.x : bounds.y) / maxPer;
        const scalarX = (bounds.x - radius - radius) / max.x;
        const scalarY = (bounds.y - radius - radius) / max.y;
        const conversion = (tile: ITileDto) => {
            let {x, z} = RenderingUtilities.to3dCoordinates(
                tile.orderedTriple,
                board.doubleIncrement,
                board.applyHexRowScaling
            );
            x += offsetX;
            z += offsetY;
            const canvasX = x * scalarX;
            let canvasY = z * scalarY;
            if (board.applyHexRowScaling) {
                let transformY = ((bounds.y / RenderingConstants.HEX_ROW_SCALAR) - bounds.y) / 2; 
                canvasY += transformY;
            }
            return {
                x: canvasX,
                y: canvasY
            } as IPoint;
        }
        const tilesWithPoints: [ITileDto, IPoint][] = board.tiles.map(tile => [tile, conversion(tile)]);
        for(const item of tilesWithPoints) {
            this.drawTile(ctx, board, item["0"], item["1"], radius * 2, currentVessel);
        }
    }

    private drawTile(ctx: CanvasRenderingContext2D, board: IBoardDto, tile: ITileDto, canvasPoint: IPoint, size: number, currentVessel: IVesselDto | null) {
        // use tile coordinates and bounds to place tile
        const strokeStyle = "rgba(255, 255, 255, 0.75)";
        let fillStyle = strokeStyle;
        switch(tile.terrain) {
            case "Coast":
                fillStyle = "rgba(255, 255, 153, 0.85)";
                break;
            case "Land":
                fillStyle = "rgba(102, 153, 51, 0.85)";
                break;
            case "Water":
                fillStyle = "rgba(43, 43, 204, 0.75)";
                break;
        }
        if (currentVessel && currentVessel.orderedTriple.toString() == tile.orderedTriple.toString()) {
            fillStyle = "rgba(255, 255, 255, 0.85)";
        }
        //ctx.fillText(String.fromCharCode(parseInt("2B24", 16)), canvasPoint.x, canvasPoint.y);
        if (board.tileShape == "Square") {
            this.drawSquare(ctx, canvasPoint, size, fillStyle, strokeStyle);
        } else if (board.tileShape == "Octagon") {
            this.drawOctagon(ctx, canvasPoint, size, fillStyle, strokeStyle);
        } else if (board.tileShape == "Hexagon") {
            this.drawHexagon(ctx, canvasPoint, size, fillStyle, strokeStyle);
        } else { // Circle
            this.drawCircle(ctx, canvasPoint, size, fillStyle, strokeStyle);
        }
    }

    private drawCircle(ctx: CanvasRenderingContext2D, origin: IPoint, diameter: number, fillStyle: string, strokeStyle: string) {
        const radius = diameter / 2;
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.arc(origin.x + radius, origin.y + radius, radius, 0, 2* Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    private drawSquare(ctx: CanvasRenderingContext2D, origin: IPoint, size: number, fillStyle: string, strokeStyle: string) {
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.fillRect(origin.x, origin.y, size, size);
        ctx.strokeRect(origin.x, origin.y, size, size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    private drawOctagon(ctx: CanvasRenderingContext2D, origin: IPoint, size: number, fillStyle: string, strokeStyle: string) {
        this.drawRegularPolygon(ctx, origin, size, fillStyle, strokeStyle, 8);
    }
 
    private drawHexagon(ctx: CanvasRenderingContext2D, origin: IPoint, size: number, fillStyle: string, strokeStyle: string) {
        this.drawRegularPolygon(ctx, origin, size, fillStyle, strokeStyle, 6);
    }

    private drawRegularPolygon(ctx: CanvasRenderingContext2D, origin: IPoint, size: number, fillStyle: string, strokeStyle: string, sides: number) {
        const radius = size / 2;
        const originX = origin.x + radius;
        const originY = origin.y + radius;
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        const angle = (Math.PI * 2) / sides;
        const halfAngle = angle / 2;
        const startX = originX + (radius * Math.cos(-halfAngle));
        const startY = originY + (radius * Math.sin(-halfAngle));
        ctx.beginPath();
        //ctx.rotate(angle / -2);
        ctx.moveTo(startX, startY);
        for(let i = 1; i <= sides; i++) {
            const toX = originX + (radius * Math.cos(angle * i - halfAngle));
            const toY = originY + (radius * Math.sin(angle * i - halfAngle));
            ctx.lineTo(toX, toY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}