import { RenderingComponentBase } from "../rendering-component";
import { IRenderingContext } from "../rendering-context";
import * as THREE from "three";
import { injectable, inject } from "inversify";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { BoardComponent } from "./board";
import { NavigationComponent } from "./navigation";
import { TYPES as BallastCore, IEventBus, IGameService } from "ballast-core";
import { CurrentDirectionModifiedEvent } from "../../events/current-direction-modified";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";
import { RenderingConstants } from "../rendering-constants";
import { RenderingMiddleware } from "../rendering-middleware";
import { IBallastAppState } from "../../app-state";

type GameAnimationType = 'rotateVesselCounterClockwise' | 'rotateVesselClockwise' | 'moveVesselForward';
type GameAnimation = { type: GameAnimationType, timestamp: number };

@injectable()
export class GameComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private readonly _gameService: IGameService;
    private readonly _board: BoardComponent;
    private readonly _navigation: NavigationComponent;

    // Buttons
    private _moveVesselForwardButton?: HTMLButtonElement;
    private _rotateVesselClockwiseButton?: HTMLButtonElement;
    private _rotateVesselCounterClockwiseButton?: HTMLButtonElement;
    private _vesselButtonsStyle?: Text;

    // Vessel
    private readonly _vessel: THREE.Mesh;
    private readonly _vesselPivot: THREE.Object3D;

    // Animation(s)
    private readonly _gameAnimationQueue: GameAnimation[];
    private readonly _forwardMovementTarget: THREE.Object3D;
    private readonly _forwardMovementSource: THREE.Object3D;
    private readonly _forwardMovementAnimationDuration: number;
    private _forwardMovementClock?: THREE.Clock;
    private _waitingOnMovementRequest: boolean;
    private readonly _rotationTarget: THREE.Object3D;
    private readonly _rotationAnimationDuration: number;
    private _rotationDirections: number;
    private _rotationRadians: number;
    private _rotationClock?: THREE.Clock;
    private _rotationClockwise?: boolean;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus,
        @inject(BallastCore.Application.Services.IGameService) gameService: IGameService,
        @inject(BallastUi.Rendering.Components.BoardComponent) board: BoardComponent,
        @inject(BallastUi.Rendering.Components.NavigationComponent) navigation: NavigationComponent
    
    ) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._gameService = gameService;
        this._board = board;
        this._navigation = navigation;
        // Vessel
        let vesselObjects = this.createVesselObjects();
        this._vessel = vesselObjects["0"];
        this._vesselPivot = vesselObjects["1"];
        // Animation(s)
        this._gameAnimationQueue = [];
        this._waitingOnMovementRequest = false;
        let vesselForwardMovementObjects = this.createVesselForwardMovementObjects();
        this._forwardMovementTarget = vesselForwardMovementObjects["0"];
        this._forwardMovementSource = vesselForwardMovementObjects["1"];
        this._forwardMovementAnimationDuration = RenderingConstants.MOVEMENT_DURATION_SECONDS;
        this._rotationTarget = this.createVesselRotationTargetObject();
        this._rotationAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this._rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this._rotationDirections = 8; // Default to 8 directions
    }

    protected onDisposing() {
        this.unsubscribeAll();
        this.destroyDomElements();
    }

    private get isMidAnimation(): boolean {
        return (!!this._rotationClock || !!this._forwardMovementClock);
    }

    private get hasQueuedAnimation(): boolean {
        return (!!this._gameAnimationQueue.length);
    }
    
    private rebindHandlers() {
        this.onCurrentDirectionModifiedAsync = this.onCurrentDirectionModifiedAsync.bind(this);
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
        this.onCurrentVesselModifiedAsync =this.onCurrentVesselModifiedAsync.bind(this);
        this.onMoveVesselForwardButtonClickAsync = this.onMoveVesselForwardButtonClickAsync.bind(this);
        this.onRotateVesselClockwiseButtonClickAsync = this.onRotateVesselClockwiseButtonClickAsync.bind(this);
        this.onRotateVesselCounterClockwiseButtonClickAsync = this.onRotateVesselCounterClockwiseButtonClickAsync.bind(this);
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

    private createDomElements(ownerDocument: Document) {
        let vesselButtonsAndStyle= this.createVesselButtonsAndStyle(ownerDocument);
        this._moveVesselForwardButton = vesselButtonsAndStyle["0"];
        this._moveVesselForwardButton.addEventListener('click', this.onMoveVesselForwardButtonClickAsync);
        this._rotateVesselCounterClockwiseButton = vesselButtonsAndStyle["1"];
        this._rotateVesselCounterClockwiseButton.addEventListener('click', this.onRotateVesselCounterClockwiseButtonClickAsync);
        this._rotateVesselClockwiseButton = vesselButtonsAndStyle["2"];
        this._rotateVesselClockwiseButton.addEventListener('click', this.onRotateVesselClockwiseButtonClickAsync);
        this._vesselButtonsStyle = vesselButtonsAndStyle["3"];
    }

    private destroyDomElements() {
        if (this._moveVesselForwardButton) {
            this._moveVesselForwardButton.removeEventListener('click', this.onMoveVesselForwardButtonClickAsync);
            this._moveVesselForwardButton = undefined;
        }
        if (this._rotateVesselCounterClockwiseButton) {
            this._rotateVesselCounterClockwiseButton.removeEventListener('click', this.onRotateVesselCounterClockwiseButtonClickAsync);
            this._rotateVesselCounterClockwiseButton = undefined;
        }
        if (this._rotateVesselClockwiseButton) {
            this._rotateVesselClockwiseButton.removeEventListener('click', this.onRotateVesselClockwiseButtonClickAsync);
            this._rotateVesselClockwiseButton = undefined;
        }
        if (this._vesselButtonsStyle) {
            this._vesselButtonsStyle = undefined;
        }    
    }

    private createVesselObjects() :[THREE.Mesh, THREE.Object3D] {
        // Create vessel mesh
        let vesselGeometry = new THREE.DodecahedronGeometry(1);
        let vesselMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        let vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
        // Create vessel pivot (parent) object
        let vesselPivot = new THREE.Object3D();
        vesselPivot.position.set(0, 0, 0);
        vesselPivot.rotation.reorder('YXZ');
        vesselPivot.rotateY(RenderingConstants.INITIAL_ORIENTATION_RADIANS)
        vesselPivot.add(vessel);
        // Return all objects
        return [vessel, vesselPivot];
    }

    private createVesselForwardMovementObjects(): [THREE.Object3D, THREE.Object3D] {
        return [new THREE.Object3D, new THREE.Object3D]; /// Target / Source
    }

    private createVesselRotationTargetObject(): THREE.Object3D {
        let rotationTarget = new THREE.Object3D;
        rotationTarget.rotation.reorder("YXZ");
        return rotationTarget;
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

    protected onAttached(ownerDocument: Document, parent: HTMLElement, gameStyle: HTMLStyleElement, middleware: RenderingMiddleware) {
        // Check if we need to create the vessel buttons (and other elements)
        if (!this._moveVesselForwardButton) {
            this.createDomElements(ownerDocument);
        }
        // Attach to parent DOM element
        if (this._vesselButtonsStyle) {
            gameStyle.appendChild(this._vesselButtonsStyle);
        }
        if (this._rotateVesselCounterClockwiseButton) {
            parent.appendChild(this._rotateVesselCounterClockwiseButton);
        }
        if (this._moveVesselForwardButton) {
            parent.appendChild(this._moveVesselForwardButton);
        }
        if (this._rotateVesselClockwiseButton) {
            parent.appendChild(this._rotateVesselClockwiseButton);
        }
        // Subscribe to all application events
        this.subscribeAll();
        // Attach child components
        this._board.attach(ownerDocument, parent, gameStyle, middleware);
        this._navigation.attach(ownerDocument, parent, gameStyle, middleware);
    }

    protected onDetaching() {
        // Detach child components
        this._navigation.detach();
        this._board.detach();
        // Unsubscribe from all application events
        this.unsubscribeAll();
        // Detach from parent DOM element
        if (this._parent && this._rotateVesselClockwiseButton) {
            this._parent.removeChild(this._rotateVesselClockwiseButton!);
        }
        if (this._parent && this._moveVesselForwardButton) {
            this._parent.removeChild(this._moveVesselForwardButton);
        }
        if (this._parent && this._rotateVesselCounterClockwiseButton) {
            this._parent.removeChild(this._rotateVesselCounterClockwiseButton!);
        }
        if (this._gameStyle && this._rotateVesselClockwiseButton) {
            this._gameStyle.removeChild(this._rotateVesselClockwiseButton!);
        }
        // TODO: Figure out how we can remove camera pivot from the vessel obj
        // renderingContext.detachCameraFromObject(this._vesselPivot);
    }

    private queueNewAnimation(animationType: GameAnimationType) {
        // If we already have more than one animation, check to see if the new animation cancels out the last one
        let cancelLastAnimation = false;
        if (this._gameAnimationQueue.length > 1) {
            let lastAnimation = this._gameAnimationQueue[this._gameAnimationQueue.length - 1];
            if (lastAnimation.type == "rotateVesselClockwise" && animationType == "rotateVesselCounterClockwise") {
                cancelLastAnimation = true;
            }
            if (lastAnimation.type == "rotateVesselCounterClockwise" && animationType == "rotateVesselClockwise") {
                cancelLastAnimation = true;
            }
        }
        if (cancelLastAnimation) {
            this._gameAnimationQueue.pop();
            return;
        }
        // Queue the animation
        let timestamp = Date.now();
        this._gameAnimationQueue.push({ type: animationType, timestamp: timestamp });
    }

    private dequeueNextAnimation(): GameAnimation | null {
        if (!this._gameAnimationQueue.length) {
            return null;
        }
        let nextAnimation = this._gameAnimationQueue.splice(0, 1)[0];
        return nextAnimation;
    }

    private getVesselVector3(app: IBallastAppState, vesselId: string | undefined): THREE.Vector3 {
        if (!app.currentGame || !vesselId) {
            return new THREE.Vector3(0, 0, 0);
        }
        let vessel = app.currentGame.vessels.find(x => x.id == vesselId);
        if (!vessel) {
            return new THREE.Vector3(0, 0, 0);
        }
        let vesselOrderedTriple = vessel.orderedTriple;
        let tilePosition = this._board.getTilePosition(vesselOrderedTriple);
        return tilePosition || new THREE.Vector3(0, 0, 0);
    }

    protected onFirstRender(renderingContext: IRenderingContext) {
        // Add camera as child of vessel & add vessel into secene
        renderingContext.threeScene.add(renderingContext.attachCameraToObject(this._vesselPivot));
        // Proceed with normal render
        this.onRender(renderingContext);
    }

    // TODO:  Finish implementing this from old game component

    protected onRender(renderingContext: IRenderingContext) {
        //throw new Error("Method not implemented.");
    }

    private async onRotateVesselClockwiseButtonClickAsync() {
        //throw new Error("Method not implemented.");
    }

    private async onRotateVesselCounterClockwiseButtonClickAsync() {
        //throw new Error("Method not implemented.");
    }

    private async onMoveVesselForwardButtonClickAsync() {
        //throw new Error("Method not implemented.");
    }

    private async onCurrentDirectionModifiedAsync() {
        //throw new Error("Method not implemented.");
    }

    private async onCurrentGameModifiedAsync() {
        //throw new Error("Method not implemented.");
    }

    private async onCurrentVesselModifiedAsync() {
        //throw new Error("Method not implemented.");
    }

}