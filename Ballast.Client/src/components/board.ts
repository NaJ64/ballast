import { Board, CubicCoordinates, Game, IEventBus, Tile, TileShape } from 'ballast-core';
import { inject, injectable } from 'inversify';
import * as THREE from 'three';
import { BallastViewport } from '../app/ballast-viewport';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { TYPES_BALLAST } from '../ioc/types';
import { RenderingConstants } from '../rendering/rendering-constants';
import { RenderingContext } from '../rendering/rendering-context';
import { ComponentBase } from './component-base';

@injectable()
export class BoardComponent extends ComponentBase {

    private readonly tiles: Map<CubicCoordinates, THREE.Mesh>;
    private readonly circleGeometry: THREE.RingGeometry;
    private readonly squareGeometry: THREE.RingGeometry;
    private readonly hexagonGeometry: THREE.RingGeometry;
    private readonly octagonGeometry: THREE.RingGeometry;
    private readonly tileMaterial: THREE.MeshBasicMaterial;
    private currentBoard?: Board;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker) {

        super(viewport, eventBus, perspectiveTracker);
        this.tiles = new Map<CubicCoordinates, THREE.Mesh>();
        this.circleGeometry = this.createCircleGeometry();
        this.squareGeometry = this.createSquareGeometry();
        this.octagonGeometry = this.createOctagonGeometry();
        this.hexagonGeometry = this.createHexagonGeometry();
        this.tileMaterial = this.createTileMaterial();

    }

    private createCircleGeometry() {
        let outerRadius = this.getTileOuterRadius(24);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 24, 1);
    }

    private createSquareGeometry() {
        let outerRadius = this.getTileOuterRadius(4);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 4, 1, Math.PI / 4);
    }

    private createOctagonGeometry() {
        let outerRadius = this.getTileOuterRadius(8);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 8, 1, Math.PI / 8);
    }

    private createHexagonGeometry() {
        let outerRadius = this.getTileOuterRadius(6);
        let innerRadius = this.getTileInnerRadius(outerRadius);
        return new THREE.RingGeometry(innerRadius, outerRadius, 6, 1, Math.PI / 2);
    }

    private createTileMaterial() {
        return new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
    }

    private getTileInnerRadius(outerRadius: number) {
        return outerRadius - (RenderingConstants.TILE_BORDER_WIDTH / 2);
    }

    private getTileOuterRadius(sides: number) {
        return this.getRadiusFromApothem((RenderingConstants.TILE_POSITION_SCALAR / 2), sides); 
    }

    private getRadiusFromApothem(apothem: number, sides: number) {
        return (apothem / Math.cos(Math.PI / sides));
    }

    protected onAttach(parent: HTMLElement, renderingContext: RenderingContext) { 
        // Do something (?)
    }

    protected onDetach(parent: HTMLElement, renderingContext: RenderingContext) {
        // If we have any tiles in the scene, we need to remove them
        this.removeAllTiles(renderingContext);
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Check to see if we have a new game/board (using id)
        let isNewBoard = (
            renderingContext.game && 
            renderingContext.game.board && 
            (!this.currentBoard || this.currentBoard.id != renderingContext.game.board.id)) || false;

        // Check if we have a new board to draw
        if (isNewBoard) {
            this.resetBoard(renderingContext);
        }

    }

    private resetBoard(renderingContext: RenderingContext) {

        // Store the current board
        this.currentBoard = (<Game>renderingContext.game).board;
            
        // remove old assets 
        this.removeAllTiles(renderingContext);

        // Render the tiles
        let game = <Game>renderingContext.game;
        game.board.tileMap.forEach((tile, cubicXYZ, item) => {
            this.addTile(renderingContext, tile);
        });

    }

    private addTile(renderingContext: RenderingContext, tile: Tile) {
        let offsetHex = tile.cubicCoordinates.toOffset();
        let x = offsetHex.col;
        let z = offsetHex.row;
        if ((z & 1) > 0) {
            x += 0.5;
        }
        let colSpacing = RenderingConstants.TILE_POSITION_SCALAR;
        if (tile.tileShape.doubleIncrement) {
            colSpacing *= 0.5;
        }
        let rowSpacing = colSpacing;
        if (tile.tileShape.applyHexRowScaling) {
            rowSpacing *= RenderingConstants.HEX_ROW_SCALAR;
        }
        x *= colSpacing;
        z *= rowSpacing;
        let newTileMesh = this.createTileMesh(tile.tileShape);
        newTileMesh.position.set(x, 0, z);
        this.tiles.set(tile.cubicCoordinates, newTileMesh);
        renderingContext.scene.add(newTileMesh);
    }

    private removeAllTiles(renderingContext: RenderingContext) {
        let tileMeshes = Array.from(this.tiles.values());
        for (let tileMesh of tileMeshes) {
            renderingContext.scene.remove(tileMesh);
        }
        this.tiles.clear();
    }

    private createTileMesh(tileShape: TileShape) {
        let tileGeometry: THREE.RingGeometry | undefined;
        if (tileShape.equals(TileShape.Square)) {
            tileGeometry = this.squareGeometry;
        }
        if (tileShape.equals(TileShape.Octagon)) {
            tileGeometry = this.octagonGeometry;
        }
        if (tileShape.equals(TileShape.Hexagon)) {
            tileGeometry = this.hexagonGeometry;
        }
        if (!tileGeometry) {
            tileGeometry = this.circleGeometry;
        }
        let tileMesh = new THREE.Mesh(tileGeometry, this.tileMaterial);
        tileMesh.rotation.x = (Math.PI / -2); // Lay shape flat along X and Z axis
        return tileMesh;
    }

    public getTilePosition(cubicCoordinates: CubicCoordinates) {
        let tile = this.tiles.get(cubicCoordinates);
        if (tile) {
            return tile.position;
        }
    }

}