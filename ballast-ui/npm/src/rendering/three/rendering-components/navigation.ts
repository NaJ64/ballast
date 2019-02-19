import { injectable } from "inversify";
import { ThreeRenderingComponentBase } from "../three-rendering-component";
import { ThreeRenderingContext } from "../three-rendering-context";

const TILESHAPE_SQUARE = "Square";
const TILESHAPE_CIRCLE = "Circle";
const TILESHAPE_HEXAGON = "Hexagon";
const TILESHAPE_OCTAGON = "Octagon";
const BOARDTYPE_RECTANGLE = "Rectangle";
const BOARDTYPE_REGULAR_POLYGON = "Regular Polygon";

@injectable()
export class NavigationComponent extends ThreeRenderingComponentBase {

    private _navWindow?: HTMLDivElement;
    private _navCoordinates?: HTMLLabelElement;
    private _navCompass?: HTMLLabelElement;

    public constructor() {
        super();
    }

    protected onDisposing() {
        this._navWindow = undefined;
        this._navCoordinates = undefined;
        this._navCompass = undefined;
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
    }

    protected onDetaching(parent: HTMLElement) {
        // Remove the nav window from the page
        if (this._navWindow) {
            parent.removeChild(this._navWindow);
        }
    }

    protected onRender(renderingContext: ThreeRenderingContext) {

        // Detect if our vessel moved
        if (renderingContext.application.currentVesselModified) {
            this.updateVesselAndDisplayCoordinates(renderingContext);
        }

        // Detect if our compass heading has changed
        if (renderingContext.application.currentDirectionModified) {
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

    private updateCompass(renderingContext: ThreeRenderingContext) {
        if (!this._navCompass) {
            return; // Can't display compass yet
        }
        if (!renderingContext.application.currentGame) {
            this._navCompass.innerText = "";
            return;
        }
        let tileShape = renderingContext.application.currentGame.board.tileShape;
        let direction = renderingContext.perspectiveTracker.getCardinalDirection(tileShape);
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

    private updateVesselAndDisplayCoordinates(renderingContext: ThreeRenderingContext) {
        if (!this._navCoordinates) {
            return; // Can't display coordinates yet
        }
        let game = renderingContext.application.currentGame;
        let scalingFactor: number = 1;
        let boardType: string = BOARDTYPE_REGULAR_POLYGON;
        let tileShape: string = TILESHAPE_HEXAGON;
        if (game) {
            if (game.board.doubleIncrement) {
                scalingFactor = 2;
            }
            boardType = game.board.type;
            tileShape = game.board.tileShape;
        }
        let cubicOrderedTriple: number[] = [];
        let vessel = renderingContext.application.currentVessel;
        if (vessel) {
            cubicOrderedTriple = vessel.orderedTriple;
        }
        let coordinatesText = "";
        let northSouthInversion = -1;
        if (boardType.toLocaleLowerCase() == BOARDTYPE_RECTANGLE.toLocaleLowerCase()) {
            northSouthInversion = 1;
        }
        let useOffset = boardType.toLocaleLowerCase() == BOARDTYPE_RECTANGLE.toLocaleLowerCase() 
            || tileShape.toLocaleLowerCase() == TILESHAPE_SQUARE.toLocaleLowerCase() 
            || tileShape.toLocaleLowerCase() == TILESHAPE_OCTAGON.toLocaleLowerCase();
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