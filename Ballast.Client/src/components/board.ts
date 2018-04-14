import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';
import { IEvent } from '../messaging/ievent';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { Game, Board, Tile, CubicCoordinates, TileShape } from 'ballast-core';

@injectable()
export class BoardComponent extends ComponentBase {

    private static readonly hexRowScalar: number = Math.sqrt(3) / 2;
    private readonly perspectiveTracker: PerspectiveTracker;
    private currentBoardId?: string;
    private inverted?: boolean;

    private squareGeometry!: THREE.CircleGeometry;
    private hexagonGeometry!: THREE.CircleGeometry;
    private octagonGeometry!: THREE.CircleGeometry;
    private circleGeometry!: THREE.CircleGeometry;
    private tileMaterial!: THREE.MeshBasicMaterial;

    public constructor(
        @inject(TYPES_BALLAST.BallastViewport) viewport: BallastViewport,
        @inject(TYPES_BALLAST.IEventBus) eventBus: IEventBus,
        @inject(TYPES_BALLAST.PerspectiveTracker) perspectiveTracker: PerspectiveTracker
    ) {
        super(viewport, eventBus);
        this.perspectiveTracker = perspectiveTracker;
        this.cacheStaticAssets();
    }

    private cacheStaticAssets() {
        this.circleGeometry = new THREE.CircleGeometry( 1, 24);
        this.squareGeometry = new THREE.CircleGeometry( 2, 4, Math.PI / 4);
        this.octagonGeometry = new THREE.CircleGeometry( 2, 8, Math.PI / 8);
        this.hexagonGeometry = new THREE.CircleGeometry( 2, 6, Math.PI / 3);
        this.tileMaterial = new THREE.MeshBasicMaterial( { color: 0x0000cc, side: THREE.FrontSide } );
    }

    protected render(parent: HTMLElement, renderingContext: RenderingContext) {

        // Check to see if we have a new game/board (using id)
        let boardId = renderingContext && renderingContext.game && renderingContext.game.board.id;
        if (!boardId) {
            // remove old assets (?)
        }

        // Check if we have a new board to draw
        if (!!boardId && this.currentBoardId != boardId) {

            // TESTING
            //renderingContext.scene.add(this.plane);
            console.log('drawing new board');

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
        let spacing = 4;
        let x = offsetHex.col;
        if (tile.tileShape.equals(TileShape.Hexagonal)) {
            // if ((x & 1)) {
            //     x += 0.5;
            // }
        }
        let z = offsetHex.row;
        if (tile.tileShape.doubleIncrement) {
            spacing *= 0.5
        }
        if (tile.tileShape.applyHexRowScaling) {
            // Do something here
        }
        let newTileMesh = this.createTileMesh(tile.tileShape);
        newTileMesh.position.set(x * spacing, 0, z * spacing);
        renderingContext.scene.add(newTileMesh);
    }

    private createTileMesh(tileShape: TileShape) {
        let tileGeometry: THREE.CircleGeometry | undefined;
        if (tileShape.equals(TileShape.Square)) {
            tileGeometry = this.squareGeometry;
        }
        if (tileShape.equals(TileShape.Octagonal)) {
            tileGeometry = this.octagonGeometry;
        }
        if (tileShape.equals(TileShape.Hexagonal)) {
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