import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { RenderingConstants } from '../rendering/rendering-constants';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/event-bus';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { Game, Board, Tile, CubicCoordinates, TileShape } from 'ballast-core';

@injectable()
export class BoardComponent extends ComponentBase {

    private readonly perspectiveTracker: PerspectiveTracker;
    private currentBoardId?: string;
    private inverted?: boolean;

    private squareGeometry!: THREE.RingGeometry;
    private hexagonGeometry!: THREE.RingGeometry;
    private octagonGeometry!: THREE.RingGeometry;
    private circleGeometry!: THREE.RingGeometry;
    private tileMaterial!: THREE.MeshBasicMaterial;
    private tileMeshes: THREE.Mesh[];

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker
    ) {
        super(viewport, eventBus);
        this.perspectiveTracker = perspectiveTracker;
        this.tileMeshes = [];
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        this.circleGeometry = this.createCircleGeometry();
        this.squareGeometry = this.createSquareGeometry();
        this.octagonGeometry = this.createOctagonGeometry();
        this.hexagonGeometry = this.createHexagonGeometry();
        this.tileMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.FrontSide });
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

    private getTileInnerRadius(outerRadius: number) {
        return outerRadius - (RenderingConstants.TILE_BORDER_WIDTH / 2);
    }

    private getTileOuterRadius(sides: number) {
        return this.getRadiusFromApothem((RenderingConstants.TILE_POSITION_SCALAR / 2), sides); 
    }

    private getRadiusFromApothem(apothem: number, sides: number) {
        return (apothem / Math.cos(Math.PI / sides));
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Check to see if we have a new game/board (using id)
        let boardId = renderingContext && renderingContext.game && renderingContext.game.board.id;
        if (!boardId) {
            // remove old assets 
            this.removeAllTileMeshes(renderingContext);
        }

        // Check if we have a new board to draw
        if (!!boardId && this.currentBoardId != boardId) {
            
            // remove old assets 
            this.removeAllTileMeshes(renderingContext);

            // Render the tiles
            let game = <Game>renderingContext.game;
            game.board.tileMap.forEach((tile, cubicXYZ, item) => {
                this.drawTile(renderingContext, tile);
            });

        }

        // Update board id
        this.currentBoardId = boardId;

    }

    private drawTile(renderingContext: RenderingContext, tile: Tile) {
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
        this.tileMeshes.push(newTileMesh);
        newTileMesh.position.set(x, 0, z);
        renderingContext.scene.add(newTileMesh);
    }

    private removeAllTileMeshes(renderingContext: RenderingContext) {
        let tileMeshes = this.tileMeshes;
        for (let tileMesh of tileMeshes) {
            renderingContext.scene.remove(tileMesh);
        }
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

}