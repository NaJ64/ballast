import { RenderingComponentBase } from "../rendering-component";
import { IRenderingContext } from "../rendering-context";
import * as THREE from "three";
import { injectable, inject } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { BoardComponent } from "./board";
import { NavigationComponent } from "./navigation";
import { TYPES as BallastCore, IEventBus } from "ballast-core";
import { CurrentDirectionModifiedEvent } from "../../events/current-direction-modified";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";

type GameAnimationType = 'rotateVesselCounterClockwise' | 'rotateVesselClockwise' | 'moveVesselForward';
type GameAnimation = { type: GameAnimationType, timestamp: number };

@injectable()
export class GameComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;

    // Buttons / styling
    private _moveVesselForwardButton?: HTMLButtonElement;
    private _rotateVesselClockwiseButton?: HTMLButtonElement;
    private _rotateVesselCounterClockwiseButton?: HTMLButtonElement;
    private _vesselButtonsStyle?: Text;

    // Board
    private readonly _board: BoardComponent;

    // Navigation
    private readonly _navigation: NavigationComponent;
    
    // // Vessel
    // private readonly _vessel: THREE.Mesh;
    // private readonly _vesselPivot: THREE.Object3D;

    // // Queued game animations
    // private readonly _gameAnimationQueue: GameAnimation[];

    // // Forward movement animation types
    // private readonly _forwardMovementTarget: THREE.Object3D;
    // private readonly _forwardMovementSource: THREE.Object3D;
    // private readonly _forwardMovementAnimationDuration: number;
    // private _forwardMovementClock?: THREE.Clock;
    // private _waitingOnMovementRequest: boolean;

    // // Rotation animation types
    // private readonly _rotationTarget: THREE.Object3D;
    // private readonly _rotationAnimationDuration: number;
    // private _rotationDirections: number;
    // private _rotationRadians: number;
    // private _rotationClock?: THREE.Clock;
    // private _rotationClockwise?: boolean;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastUi.Rendering.Components.BoardComponent) board: BoardComponent,
        @inject(BallastUi.Rendering.Components.NavigationComponent) navigation: NavigationComponent
    ) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._board = board;
        this._navigation = navigation;
    }

    protected onDisposing() {
        // TODO:  Get rid of stuff here
        this.unsubscribeAll();
    }
    
    private rebindHandlers() {
        this.onMoveVesselForwardButtonClickAsync = this.onMoveVesselForwardButtonClickAsync.bind(this);
        this.onRotateVesselClockwiseButtonClickAsync = this.onRotateVesselClockwiseButtonClickAsync.bind(this);
        this.onRotateVesselCounterClockwiseButtonClickAsync = this.onRotateVesselCounterClockwiseButtonClickAsync.bind(this);
        this.onCurrentDirectionModifiedAsync = this.onCurrentDirectionModifiedAsync.bind(this);
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
        this.onCurrentVesselModifiedAsync =this.onCurrentVesselModifiedAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.subscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.subscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.unsubscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
    }

    private createVesselButtonsAndStyle(ownerDocument: Document): [HTMLButtonElement, HTMLButtonElement, HTMLButtonElement, Text] {
        // Create some CSS to add to the game style header tag (for media query'ing the buttons)
        let vesselButtonsStyle = ownerDocument.createTextNode(`
            .ballastMoveForwardButton {
                position: absolute;
                color: white;
                background-color: transparent;
                border-width: 0px;
                border-style: solid;
                border-color: rgba(255, 255, 255, 0.1);
                text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                font-size: 5vw;
                top: 15%;
                left: 50%;
                transform: translate(-50%, -50%)
            }
            .ballastRotateButton { 
                transform: rotate(180deg);
                position: absolute;
                color: white;
                background-color: transparent;
                border-width: 0px;
                border-style: solid;
                border-color: rgba(255, 255, 255, 0.1);
                text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                font-size: 5vw;
                top: 10%;
            } 
            @media screen and (min-width: 1000px) { 
                .ballastMoveForwardButton { 
                    font-size: 50px;
                } 
                .ballastRotateButton { 
                    font-size: 50px;
                } 
            }
        `);
        // Move forward button (top middle)
        let moveVesselForwardButton = ownerDocument.createElement('button');
        moveVesselForwardButton.innerHTML = '&#8593';
        moveVesselForwardButton.type = 'button';
        moveVesselForwardButton.className = 'ballastMoveForwardButton';
        // Counter clockwise button (top right)
        let rotateVesselCounterClockwiseButton = ownerDocument.createElement('button');
        rotateVesselCounterClockwiseButton.innerHTML = '&#8634';
        rotateVesselCounterClockwiseButton.type = 'button';
        rotateVesselCounterClockwiseButton.className = 'ballastRotateButton';
        rotateVesselCounterClockwiseButton.style.cssFloat = 'left';
        rotateVesselCounterClockwiseButton.style.left = '5.63%';
        // Counter clockwise button (top left)
        let rotateVesselClockwiseButton = ownerDocument.createElement('button');
        rotateVesselClockwiseButton.innerHTML = '&#8635';
        rotateVesselClockwiseButton.type = 'button';
        rotateVesselClockwiseButton.className = 'ballastRotateButton';
        rotateVesselClockwiseButton.style.cssFloat = 'right';
        rotateVesselClockwiseButton.style.right = '5.63%';
        // Return all buttons and style text node
        return [
            moveVesselForwardButton, 
            rotateVesselCounterClockwiseButton, 
            rotateVesselClockwiseButton,
            vesselButtonsStyle
        ];
    }

    protected onAttached(parent: HTMLElement) {
        // Check if we need to create the vessel buttons (and other elements)
        if (!this._moveVesselForwardButton) {
            let ownerDocument = parent.ownerDocument!;
            let vesselButtonsAndStyle= this.createVesselButtonsAndStyle(ownerDocument);
            this._moveVesselForwardButton = vesselButtonsAndStyle["0"];
            this._rotateVesselCounterClockwiseButton = vesselButtonsAndStyle["1"];
            this._rotateVesselClockwiseButton = vesselButtonsAndStyle["2"];
            this._vesselButtonsStyle = vesselButtonsAndStyle["3"];
        }
        // Add nav window onto parent element
        this._moveVesselForwardButton && parent.appendChild(this._moveVesselForwardButton);
        this._rotateVesselCounterClockwiseButton && parent.appendChild(this._rotateVesselCounterClockwiseButton);
        this._rotateVesselClockwiseButton && parent.appendChild(this._rotateVesselClockwiseButton);
        // Subscribe to all application events
        this.subscribeAll();
    }

    protected onDetaching(parent: HTMLElement) {
        // Unsubscribe from all application events
        this.unsubscribeAll();
        // Remove the nav window from the page
        if (this._moveVesselForwardButton) {
            parent.removeChild(this._moveVesselForwardButton);
            parent.removeChild(this._rotateVesselCounterClockwiseButton!);
            parent.removeChild(this._rotateVesselClockwiseButton!);
        }
    }

    protected onRender(renderingContext: IRenderingContext) {
        //throw new Error("Method not implemented.");
    }

    private async onRotateVesselClockwiseButtonClickAsync() {

    }

    private async onRotateVesselCounterClockwiseButtonClickAsync() {
        
    }

    private async onMoveVesselForwardButtonClickAsync() {
        
    }

    private async onCurrentDirectionModifiedAsync() {

    }

    private async onCurrentGameModifiedAsync() {
        
    }

    private async onCurrentVesselModifiedAsync() {

    }



}