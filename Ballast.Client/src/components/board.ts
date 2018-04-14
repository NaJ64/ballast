import * as THREE from 'three';
import { injectable, inject } from 'inversify';
import { TYPES_BALLAST } from '../ioc/types';
import { ComponentBase } from './component-base';
import { RenderingContext } from '../rendering/rendering-context';
import { BallastViewport } from '../app/ballast-viewport';
import { IEventBus } from '../messaging/ievent-bus';
import { IEvent } from '../messaging/ievent';
import { PerspectiveTracker } from '../input/perspective-tracker';
import { Game, Board, Tile, CubicCoordinates } from 'ballast-core';

@injectable()
export class BoardComponent extends ComponentBase {

    private static readonly hexRowScalar: number = Math.sqrt(3) / 2;
    private readonly perspectiveTracker: PerspectiveTracker;
    private currentBoardId?: string;
    private inverted?: boolean;

    private planeGeometry!: THREE.PlaneGeometry;
    private planeMaterial!: THREE.MeshBasicMaterial;
    private plane!: THREE.Mesh;

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
        // Create plane
        this.planeGeometry = new THREE.PlaneGeometry( 6, 6 );
        this.planeMaterial = new THREE.MeshBasicMaterial( { color: 0x000099, side: THREE.FrontSide } );
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = Math.PI / -2; // Lay plane flat along X and Z axis
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
        let x = offsetHex.col;
        let z = offsetHex.row;
        let position = new THREE.Vector3(x, 0, z);
        if (tile.tileShape.applyHexRowScaling) {
            
        }
        if (tile.tileShape.doubleIncrement) {
            
        }
    }

}