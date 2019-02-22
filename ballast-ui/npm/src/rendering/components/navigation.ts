import { IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import { IRenderingContext } from "../rendering-context";
import { CurrentDirectionModifiedEvent, ICurrentDirectionModifiedEvent } from '../../events/current-direction-modified';
import { CurrentVesselModifiedEvent, ICurrentVesselModifiedEvent } from '../../events/current-vessel-modified';
import { RenderingComponentBase } from '../rendering-component';
import { BallastAppConstants } from "../../app-constants";

@injectable()
export class NavigationComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private _navWindow?: HTMLDivElement;
    private _navCoordinates?: HTMLLabelElement;
    private _navCompass?: HTMLLabelElement;
    private _directionNeedsUpdate: boolean;
    private _vesselNeedsUpdate: boolean;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super();
        this.rebindAllHandlers();
        this._eventBus = eventBus;
        this._directionNeedsUpdate = false;
        this._vesselNeedsUpdate = false;
    }

    protected onDisposing() {
        this.unsubscribeAll();
        this._navWindow = undefined;
        this._navCoordinates = undefined;
        this._navCompass = undefined;
        this._directionNeedsUpdate = false;
        this._vesselNeedsUpdate = false;
    }

    private rebindAllHandlers() {
        this.onCurrentDirectionModifiedEventAsync = this.onCurrentDirectionModifiedEventAsync.bind(this);
        this.onCurrentVesselModifiedEventAsync = this.onCurrentVesselModifiedEventAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedEventAsync);
        this._eventBus.subscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedEventAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedEventAsync);
        this._eventBus.unsubscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedEventAsync);
    }

    private onCurrentDirectionModifiedEventAsync(evt: ICurrentDirectionModifiedEvent) {
        this._directionNeedsUpdate = true;
        return Promise.resolve();
    }

    private onCurrentVesselModifiedEventAsync(evt: ICurrentVesselModifiedEvent) {
        this._vesselNeedsUpdate = true;
        return Promise.resolve();
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
        this.subscribeAll();
    }

    protected onDetaching(parent: HTMLElement) {
        // Unsubscribe from all application events
        this.unsubscribeAll();
        // Remove the nav window from the page
        if (this._navWindow) {
            parent.removeChild(this._navWindow);
        }
    }

    protected onRender(renderingContext: IRenderingContext) {

        // Detect if our vessel moved
        if (this._vesselNeedsUpdate) {
            this.updateVesselAndDisplayCoordinates(renderingContext);
        }

        // Detect if our compass heading has changed
        if (this._directionNeedsUpdate) {
            this.updateCompass(renderingContext);
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

    private updateCompass(renderingContext: IRenderingContext) {
        if (!this._navCompass) {
            return; // Can't display compass yet
        }
        if (!renderingContext.app.currentGame) {
            this._navCompass.innerText = "";
            return;
        }
        let tileShape = renderingContext.app.currentGame.board.tileShape;
        let direction = renderingContext.cameraTracker.getDirection(tileShape);
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
        this._directionNeedsUpdate = false; // Reset flag because we just refreshed the direction/heading
    }

    private updateVesselAndDisplayCoordinates(renderingContext: IRenderingContext) {
        if (!this._navCoordinates) {
            return; // Can't display coordinates yet
        }
        let game = renderingContext.app.currentGame;
        let scalingFactor: number = 1;
        let boardType: string = BallastAppConstants.BOARD_TYPE_REGULAR_POLYGON;
        let tileShape: string = BallastAppConstants.TILE_SHAPE_HEXAGON;
        if (game) {
            if (game.board.doubleIncrement) {
                scalingFactor = 2;
            }
            boardType = game.board.type;
            tileShape = game.board.tileShape;
        }
        let cubicOrderedTriple: number[] = [];
        let vessel = renderingContext.app.currentVessel;
        if (vessel) {
            cubicOrderedTriple = vessel.orderedTriple;
        }
        let coordinatesText = "";
        let northSouthInversion = -1;
        if (boardType.toLocaleLowerCase() == BallastAppConstants.BOARD_TYPE_RECTANGLE.toLocaleLowerCase()) {
            northSouthInversion = 1;
        }
        let useOffset = boardType.toLocaleLowerCase() == BallastAppConstants.BOARD_TYPE_RECTANGLE.toLocaleLowerCase() 
            || tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_SQUARE.toLocaleLowerCase() 
            || tileShape.toLocaleLowerCase() == BallastAppConstants.TILE_SHAPE_OCTAGON.toLocaleLowerCase();
        if (cubicOrderedTriple.length) {
            if (useOffset) {
                let offset = this.getOffsetCoordinates(cubicOrderedTriple)
                coordinatesText = `${(northSouthInversion * offset.row / scalingFactor)}, ${offset.col / scalingFactor}`;
            } else { // Default circle / hexagon
                let axial = this.getAxialCoordinates(cubicOrderedTriple);
                coordinatesText = `${axial.x / scalingFactor}, ${northSouthInversion * axial.z / scalingFactor}`;
            }
        }
        this._navCoordinates.innerText = coordinatesText;
        this._vesselNeedsUpdate = false; // Reset flag because we just refreshed the vessel
    }

    private getAxialCoordinates(cubicOrderedTriple: number[]) {
        return { x: cubicOrderedTriple[0], z: cubicOrderedTriple[2] };
    }

    private getOffsetCoordinates(cubicOrderedTriple: number[]) {
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = cubicOrderedTriple[0] + (cubicOrderedTriple[2] - (cubicOrderedTriple[2] & 1)) / 2;
        let row = cubicOrderedTriple[2];
        return { col: col, row: row };
    }

}