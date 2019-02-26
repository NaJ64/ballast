import { RenderingComponentBase } from "../rendering-component";
import * as THREE from "three";
import { injectable, inject } from "inversify";
import { RenderingConstants } from "../rendering-constants";
import { FrontSide } from "three";
import { IRenderingContext } from "../rendering-context";
import { BallastAppConstants } from "../../app-constants";
import { ITileDto, IBoardDto, TYPES as BallastCore, IEventBus } from "ballast-core";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";

type OffsetCoordinates = { col: number, row: number };

@injectable()
export class BoardComponent extends RenderingComponentBase { 

    private readonly _eventBus: IEventBus;
    private readonly _tiles: Map<string, THREE.Mesh>;
    private readonly _tileCircleGeometry: THREE.RingGeometry;
    private readonly _tileSquareGeometry: THREE.RingGeometry;
    private readonly _tileHexagonGeometry: THREE.RingGeometry;
    private readonly _tileOctagonGeometry: THREE.RingGeometry;
    private readonly _tileMaterial: THREE.MeshBasicMaterial;
    private readonly _terrainLandGeometry: THREE.ConeGeometry;
    private readonly _terrainLandMaterial: THREE.MeshLambertMaterial;
    private readonly _terrainCoastGeometry: THREE.ConeGeometry;
    private readonly _terrainCoastMaterial: THREE.MeshLambertMaterial;
    private _boardNeedsReset: boolean;
    private _boardResetForId: string | null;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._tiles = new Map<string, THREE.Mesh>();
        this._tileCircleGeometry = this.createCircleGeometry();
        this._tileSquareGeometry = this.createSquareGeometry();
        this._tileOctagonGeometry = this.createOctagonGeometry();
        this._tileHexagonGeometry = this.createHexagonGeometry();
        this._tileMaterial = this.createTileMaterial();
        let land = this.createLandTerrain();
        this._terrainLandMaterial = land["0"];
        this._terrainLandGeometry = land["1"];
        let coast = this.createCoastTerrain();
        this._terrainCoastMaterial = coast["0"];
        this._terrainCoastGeometry = coast["1"];
        this._boardResetForId = null;
        this._boardNeedsReset = false;
    }

    protected onDisposing() { 
        this.unsubscribeAll();
    }

    private rebindHandlers() {
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
    }

    protected onAttached() {
        // Subscribe to all application events
        this.subscribeAll();
    }

    protected onDetaching() {
        // Unsubscribe from all application events
        this.unsubscribeAll();
    }

    protected onFirstRender(renderingContext: IRenderingContext) {
        this._boardNeedsReset = true;
        this.onRender(renderingContext);
    }

    protected onRender(renderingContext: IRenderingContext) {
        // Check if we need to reset board
        if (this._boardNeedsReset) {
            this.resetBoard(renderingContext);
        }
    }

    public getTilePosition(orderedTriple: number[]): THREE.Vector3 | null {
        let tileKey = this.getTileKey(orderedTriple);
        if (!tileKey) {
            return null;
        }
        let tileMesh = this._tiles.get(tileKey);
        if (!tileMesh) {
            return null;
        }
        return tileMesh.position;
    }

    private getTileKey(orderedTriple: number[]): string | null {
        if (!orderedTriple || !Array.isArray(orderedTriple) || orderedTriple.length < 3) {
            return null;
        }
        return orderedTriple.toString();
    }

    private getTileOuterRadius(sides: number) {
        return this.getRadiusFromApothem((RenderingConstants.TILE_POSITION_SCALAR / 2), sides); 
    }

    private getTileInnerRadius(outerRadius: number) {
        return outerRadius - (RenderingConstants.TILE_BORDER_WIDTH / 2);
    }

    private getRadiusFromApothem(apothem: number, sides: number) {
        return (apothem / Math.cos(Math.PI / sides));
    }

    private getOffsetCoordinatesFromOrderedTriple(orderedTriple: number[]): OffsetCoordinates {
        if (!orderedTriple || !Array.isArray(orderedTriple) || orderedTriple.length < 3) {
            throw new Error("Cannot convert ordered triple to offset coordinates");
        }
        let x = orderedTriple[0];
        let y = orderedTriple[1];
        let z = orderedTriple[2];
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = x + (z - (z & 1)) / 2;
        let row = z;
        return { col: col, row: row };
    }

    private createCircleGeometry(): THREE.RingGeometry {
        let outerRadius = this.getTileOuterRadius(24);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 24, 1);
    }

    private createSquareGeometry(): THREE.RingGeometry {
        let outerRadius = this.getTileOuterRadius(4);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 4, 1, Math.PI / 4);
    }

    private createOctagonGeometry(): THREE.RingGeometry {
        let outerRadius = this.getTileOuterRadius(8);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 8, 1, Math.PI / 8)
    }

    private createHexagonGeometry(): THREE.RingGeometry {
        let outerRadius = this.getTileOuterRadius(6);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 6, 1, Math.PI / 6);
    }

    private createTileMaterial() {
        return new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.FrontSide
        });
    }

    private createLandTerrain(): [THREE.MeshLambertMaterial, THREE.ConeGeometry] {
        let outerRadius = this.getTileOuterRadius(24);
        let landMaterial = new THREE.MeshLambertMaterial({
            color: 0x669933,
            side: FrontSide
        });
        let landGeometry = new THREE.ConeGeometry(outerRadius, outerRadius * 0.75, 24);
        return [landMaterial, landGeometry];
    }

    private createCoastTerrain(): [THREE.MeshLambertMaterial, THREE.ConeGeometry] {
        let outerRadius = this.getTileOuterRadius(24);
        let coastMaterial = new THREE.MeshLambertMaterial({
            color: 0xffff99,
            side: THREE.FrontSide
        });
        let coastGeometry = new THREE.ConeGeometry(outerRadius, outerRadius * 0.20, 24);
        return [coastMaterial, coastGeometry];
    }

    private resetBoard(renderingContext: IRenderingContext) {
        // Remove flag(s)
        this._boardNeedsReset = false;
        // Check if we changed game(s)
        let lastResetForId = this._boardResetForId || "";
        let currentBoardId = 
            renderingContext.app.currentGame && 
            renderingContext.app.currentGame.board.id || "";
        if (lastResetForId == currentBoardId) {
            return; // Do nothing
        }
        // Reset board/tiles
        let board = renderingContext.app.currentGame &&
            renderingContext.app.currentGame.board;
        if (!board) {
            this._boardResetForId = null;
            return; // Nothing else we can do
        } else {
            this._boardResetForId = board.id;
        }
        this.removeAllTiles(renderingContext); // Remove old assets
        for(let tile of board.tiles) {
            this.addTile(renderingContext, board, tile);
        }
    }

    private addTile(renderingContext: IRenderingContext, board: IBoardDto, tile: ITileDto) {
        let offsetHex = this.getOffsetCoordinatesFromOrderedTriple(tile.orderedTriple);
        let x = offsetHex.col;
        let z = offsetHex.row;
        if ((z & 1) > 0) {
            x += 0.5;
        }
        let colSpacing = RenderingConstants.TILE_POSITION_SCALAR;
        if (board.doubleIncrement) {
            colSpacing *= 0.5;
        }
        let rowSpacing = colSpacing;
        if (board.applyHexRowScaling) {
            rowSpacing *= RenderingConstants.HEX_ROW_SCALAR;
        }
        x *= colSpacing;
        z *= rowSpacing;
        let tileMesh = this.createTileMesh(tile.tileShape);
        tileMesh.position.set(x, 0, z);
        if (!tile.passable) {
            let terrainGeometry = this._terrainLandGeometry;
            let terrainMaterial = this._terrainLandMaterial;
            if (tile.terrain == BallastAppConstants.TERRAIN_COAST) {
                terrainGeometry = this._terrainCoastGeometry;
                terrainMaterial = this._terrainCoastMaterial;
            }
            let terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
            terrainMesh.rotation.x = (Math.PI / 2); // Lay shape flat along X and Z axis
            tileMesh.add(terrainMesh);
        }
        let tileKey = this.getTileKey(tile.orderedTriple);
        if (!tileKey) {
            throw new Error(`Could not convert ordered triple ${tile.orderedTriple.toString()} to tile key`);
        }
        this._tiles.set(tileKey, tileMesh);
        renderingContext.threeScene.add(tileMesh);
    }

    private removeAllTiles(renderingContext: IRenderingContext) {
        let tileMeshes = Array.from(this._tiles.values());
        for(let tileMesh of tileMeshes) {
            renderingContext.threeScene.remove(tileMesh);
        }
        this._tiles.clear();
    }

    private createTileMesh(tileShape: string): THREE.Mesh {
        let tileGeometry: THREE.RingGeometry | undefined;
        if (tileShape == BallastAppConstants.TILE_SHAPE_SQUARE) {
            tileGeometry = this._tileSquareGeometry;
        } 
        if (tileShape == BallastAppConstants.TILE_SHAPE_OCTAGON) {
            tileGeometry = this._tileOctagonGeometry;
        }
        if (tileShape == BallastAppConstants.TILE_SHAPE_HEXAGON) {
            tileGeometry = this._tileHexagonGeometry
        }
        if (!tileGeometry) {
            tileGeometry = this._tileCircleGeometry;
        }
        let tileMesh = new THREE.Mesh(tileGeometry, this._tileMaterial);
        tileMesh.rotation.x = (Math.PI / -2); // Lay shape flat along X and Z axis
        return tileMesh;
    }

    private onCurrentGameModifiedAsync() {
        this._boardNeedsReset = true;
        return Promise.resolve();
    }

}