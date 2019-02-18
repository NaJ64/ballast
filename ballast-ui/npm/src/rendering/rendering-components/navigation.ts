import { RenderingComponentBase, IRenderingComponent } from "../rendering-component";
import { IEventBus, TYPES as BallastCore, IDirection, IGameDto, IVesselDto } from "ballast-core";
import { injectable, inject } from "inversify";
import { IRenderingContext } from "../rendering-context";
import { IApplicationContext } from "../../app/application-context";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { ThreeRenderingComponentBase } from '../three/three-rendering-component';
import { ThreeRenderingContext, ThreePerspectiveTracker } from '../three';

@injectable()
export class NavigationComponent extends ThreeRenderingComponentBase implements IRenderingComponent {

    private readonly _applicationContext: IApplicationContext;
    private readonly _eventBus: IEventBus;

    private _navWindow?: HTMLDivElement;
    private _navCoordinates?: HTMLLabelElement;
    private _navCompass?: HTMLLabelElement;

    private _currentGame?: IGameDto | null;
    private _currentVessel?: IVesselDto | null;
    private _currentDirection?: IDirection;

    public constructor(
        @inject(BallastUi.App.IApplicationContext) applicationContext: IApplicationContext,
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super();
        this.rebindAllHandlers();
        this._applicationContext = applicationContext;
        this._eventBus = eventBus;
    }

    protected onDisposing() {
        this.unsubscribeAllApplicationEvents();
        this._navWindow = undefined;
        this._navCoordinates = undefined;
        this._navCompass = undefined;
    }

    private rebindAllHandlers() {
        // TODO:  Determine if we actually need any application event subs
    }

    private subscribeAllApplicationEvents() {
        // TODO:  Determine if we actually need any application event subs
    }

    private unsubscribeAllApplicationEvents() {
        // TODO:  Determine if we actually need any application event subs
    }

    protected onAttached(parent: HTMLElement) {
        // Check if we need to create the navigation window (and other elements)
        if (!this._navWindow) {
            let ownerDocument = parent.ownerDocument!;
            let navElements = this.createNavElements(ownerDocument);
            this._navWindow = navElements["0"];
            this._navCoordinates = navElements["1"];
            this._navCompass = navElements["2"];
        }
        // Add nav window onto parent element
        parent.appendChild(this._navWindow);
        // Subscribe to all application events
        this.subscribeAllApplicationEvents();
    }

    protected onDetaching(parent: HTMLElement) {
        // Unsubscribe from all application events
        this.unsubscribeAllApplicationEvents();
        // Remove the nav window from the page
        if (this._navWindow) {
            parent.removeChild(this._navWindow);
        }
    }

    protected onRender(renderingContext: ThreeRenderingContext) {

        // Detect if we have a new game
        let isNewGame = this.getIsNewGame();
        if (isNewGame) {
            this.resetGame(renderingContext.perspectiveTracker);
        }

        // Detect if our vessel moved
        let vesselHasMoved = this.getVesselHasMoved();
        if (vesselHasMoved) {
            this.updateVesselAndDisplayCoordinates();
        }

        // Detect if our compass heading has changed
        let directionHasChanged = this.getDirectionHasChanged(renderingContext.perspectiveTracker);
        if (directionHasChanged) {
            this.updateCompass(renderingContext.perspectiveTracker);
        }

    }

    private createNavElements(ownerDocument: Document): [
        HTMLDivElement,
        HTMLLabelElement,
        HTMLLabelElement
    ] {

        let navWindow = ownerDocument.createElement("div");
        navWindow.style.cssFloat = 'left';
        navWindow.style.position = 'absolute';
        navWindow.style.zIndex = '1000';
        navWindow.style.left = '12px';
        navWindow.style.bottom = '12px';
        navWindow.style.height = '49px';
        navWindow.style.width = 'calc(15% - 2px)';
        navWindow.style.borderWidth = '1px';
        navWindow.style.borderStyle = 'none';
        navWindow.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        let navCoordinates = ownerDocument.createElement("label");
        navCoordinates.style.textShadow = '1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)';
        navCoordinates.style.cssFloat = 'bottom';
        navCoordinates.style.position = 'absolute';
        navCoordinates.style.zIndex = '1001';
        navCoordinates.style.left = '0px';
        navCoordinates.style.bottom = '0px';
        navCoordinates.style.height = '24px';
        navCoordinates.style.width = '100%';
        navCoordinates.style.backgroundColor = 'transparent';
        navCoordinates.style.borderStyle = 'none';
        navCoordinates.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        navCoordinates.style.color = 'white';
        navWindow.appendChild(navCoordinates);

        let navCompass = ownerDocument.createElement("label");
        navCompass.style.textShadow = '1px 1px 2px rgb(0, 0, 0), -1px 1px 2px rgb(0, 0, 0), 1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)';
        navCompass.style.cssFloat = "bottom";
        navCompass.style.position = 'absolute';
        navCompass.style.zIndex = '1002';
        navCompass.style.left = '0px';
        navCompass.style.bottom = '25px';
        navCompass.style.height = '24px';
        navCompass.style.width = '100%';
        navCompass.style.backgroundColor = 'transparent';
        navCompass.style.borderStyle = 'none';
        navCompass.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        navCompass.style.color = 'white';
        navWindow.appendChild(navCompass);

        return [navWindow, navCoordinates, navCompass];

    }

    private resetGame(perspectiveTracker: ThreePerspectiveTracker) {

        this._currentGame = JSON.parse(JSON.stringify(this._applicationContext.currentGame));
        this._currentVessel = JSON.parse(JSON.stringify(this._applicationContext.currentVessel));
        this._currentDirection = undefined; // This will be fixed on the next render loop iteration

        this.updateVesselAndDisplayCoordinates();
        this.updateCompass(perspectiveTracker);

    }

    private getIsNewGame(): boolean {
        return this._applicationContext.currentGame &&
            (!this._currentGame || this._applicationContext.currentGame.id != this._currentGame.id)
            || false;
    }

    private getVesselHasMoved(): boolean {
        // Compare old vessel info to new vessel info
        let oldVessel = this._currentVessel;
        let newVessel = this._applicationContext.currentVessel;
        if (!oldVessel && newVessel) {
            return true;
        }
        let oldCoords = oldVessel && oldVessel.orderedTriple.slice(0) || [0, 0, 0];
        let newCoord = newVessel && newVessel.orderedTriple.slice(0) || [0, 0, 0];
        var i = oldCoords.length;
        while (i--) {
            if (oldCoords[i] != newCoord[i]) {
                return false;
            }
        }
        return true
    }

    private getDirectionHasChanged(perspectiveTracker: ThreePerspectiveTracker) {
        // If we don't have a game
        if (!this._currentGame) {
            return !!this._currentDirection; // If we don't have a game anymore (but we previously had a direction) assume it changed
        }
        // If we don't have a direction
        if (!this._currentDirection) {
            return !!this._currentGame; // If we don't have a direction yet (but we previously had a game) it's safe to assume we have a new direction
        }
        // Get the tile shape to assist with calculating cardinal direction off the perspective tracker
        let tileShape = this._currentGame.board.tileShape;
        let direction = perspectiveTracker.getCardinalDirection(tileShape);
        let directionChanged = true;
        if (
            this._currentDirection.north == direction.north &&
            this._currentDirection.south == direction.south &&
            this._currentDirection.east == direction.east &&
            this._currentDirection.west == direction.west
        ) {
            directionChanged = false;
        }
        return directionChanged;
    }

    private updateCompass(perspectiveTracker: ThreePerspectiveTracker) {
        if (!this._navCompass) {
            return; // Can't display compass yet
        }
        if (!this._currentGame) {
            this._navCompass.innerText = "";
            return;
        }
        let tileShape = this._currentGame.board.tileShape;
        let direction = perspectiveTracker.getCardinalDirection(tileShape);
        let directionHeadingText = "";
        if (direction.north) {
            directionHeadingText += "N";
        }
        if (direction.south) {
            directionHeadingText += "S";
        }
        if (direction.west) {
            directionHeadingText += "W";
        }
        if (direction.east) {
            directionHeadingText += "E";
        }
        let symbol = "";
        if (!!directionHeadingText) {
            symbol = "&uarr; "
        }
        this._navCompass.innerHTML = `${symbol}${directionHeadingText}`;
    }

    // TODO:  Update the method below to detect the latest coords and display them
    private updateVesselAndDisplayCoordinates() {
        // if (!this._navCoordinates) {
        //     return; // Can't display coordinates yet
        // }
        this._currentVessel = this._applicationContext.currentVessel;
        // let scalingFactor: number = 1;
        // let boardType: BoardType;
        // let tileType: TileShape;
        // let cubicCoordinates: CubicCoordinates | undefined;
        // if (this.currentGame) {
        //     boardType = this.currentGame.board.boardType;
        //     tileType = this.currentGame.board.tileShape;
        //     scalingFactor = this.currentGame.board.tileShape.doubleIncrement ? 2 : 1;
        // } else {
        //     boardType = BoardType.RegularPolygon; // default
        //     tileType = TileShape.Hexagon;
        //     scalingFactor = 1; // default
        // }
        // if (this.currentVessel) {
        //     cubicCoordinates = this.currentVessel.cubicCoordinates;
        // }
        // let coordinatesText = "";
        // let northSouthInversion = -1;
        // if (boardType.equals(BoardType.Rectangle)) {
        //     northSouthInversion = 1;
        // }
        // let useOffset = boardType.equals(BoardType.Rectangle) || tileType.equals(TileShape.Square) || tileType.equals(TileShape.Octagon);
        // if (cubicCoordinates) {
        //     if (useOffset) {
        //         let offset = cubicCoordinates.toOffset();
        //         coordinatesText = `${(northSouthInversion * offset.row / scalingFactor)}, ${offset.col / scalingFactor}`;
        //     } else { // Default circle / hexagon
        //         let axial = cubicCoordinates.toAxial();
        //         coordinatesText = `${axial.x / scalingFactor}, ${northSouthInversion * axial.z / scalingFactor}`;
        //     }
        // }
        // this._navCoordinates.innerText = coordinatesText;
    }

}