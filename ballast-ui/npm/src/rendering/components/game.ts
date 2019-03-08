import { IBoardDto, IEventBus, IGameService, IVesselDto, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import * as THREE from "three";
import "three/examples/js/loaders/GLTFLoader";
import { BallastAppConstants } from "../../app-constants";
import { TYPES as BallastUi } from "../../dependency-injection/types";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";
import { KeyboardWatcher } from "../../input/keyboard-watcher";
import { RenderingComponentBase } from "../rendering-component";
import { RenderingConstants } from "../rendering-constants";
import { IRenderingContext } from "../rendering-context";
import { RenderingMiddleware } from "../rendering-middleware";
import { BoardComponent } from "./board";
import { NavigationComponent } from "./navigation";

type GameAnimationType =
    'rotateVesselCounterClockwise' |
    'rotateVesselClockwise' |
    'moveVesselForward' |
    'correctVesselPosition';
type GameAnimation = { type: GameAnimationType, timestamp: number };

@injectable()
export class GameComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private readonly _gameService: IGameService;
    private readonly _board: BoardComponent;
    private readonly _navigation: NavigationComponent;
    private _gameNeedsReset: boolean;
    private _gameResetForId: string | null;

    // Buttons
    private _moveVesselForwardButton?: HTMLButtonElement;
    private _rotateVesselClockwiseButton?: HTMLButtonElement;
    private _rotateVesselCounterClockwiseButton?: HTMLButtonElement;
    private _vesselButtonsStyle?: Text;

    // Vessel
    private readonly _vesselPivot: THREE.Object3D;
    private _tempVessel: THREE.Mesh;
    private _tempVesselNeedsReplace: boolean;
    private _loadedVessel?: THREE.GLTF;
    private _vesselAnimateX: number = 0;
    private _vesselAnimateY: number = 0;
    private _vesselAnimateZ: number = 0;
    private _removeCameraFromVessel?: () => void;

    // Animation(s)
    private readonly _gameAnimationQueue: GameAnimation[];
    private readonly _movementTarget: THREE.Object3D;
    private readonly _movementSource: THREE.Object3D;
    private _movementAnimationDuration: number;
    private _movementClock?: THREE.Clock;
    private _waitingOnMovementRequest: boolean;
    private readonly _rotationTarget: THREE.Object3D;
    private _rotationAnimationDuration: number;
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
        this._tempVessel = vesselObjects["0"];
        this._vesselPivot = vesselObjects["1"];
        this._tempVesselNeedsReplace = false;
        this.loadSubmarineAsync()
            .then(submarine => {
                this._loadedVessel = submarine;
                this._tempVesselNeedsReplace = true;
            });
        // Animation(s)
        this._gameAnimationQueue = [];
        this._waitingOnMovementRequest = false;
        let vesselForwardMovementObjects = this.createVesselForwardMovementObjects();
        this._movementTarget = vesselForwardMovementObjects["0"];
        this._movementSource = vesselForwardMovementObjects["1"];
        this._movementAnimationDuration = RenderingConstants.MOVEMENT_DURATION_SECONDS;
        this._rotationTarget = this.createVesselRotationTargetObject();
        this._rotationAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this._rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default to 8 directions
        this._gameResetForId = null;
        this._gameNeedsReset = false;
    }

    protected onDisposing() {
        this.unsubscribeAll();
        this.destroyDomElements();
    }

    private rebindHandlers() {
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
        this.onCurrentVesselModifiedAsync = this.onCurrentVesselModifiedAsync.bind(this);
        this.onMoveVesselForwardButtonClickAsync = this.onMoveVesselForwardButtonClickAsync.bind(this);
        this.onRotateVesselClockwiseButtonClickAsync = this.onRotateVesselClockwiseButtonClickAsync.bind(this);
        this.onRotateVesselCounterClockwiseButtonClickAsync = this.onRotateVesselCounterClockwiseButtonClickAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.subscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
    }

    private createDomElements(ownerDocument: Document) {
        let vesselButtonsAndStyle = this.createVesselButtonsAndStyle(ownerDocument);
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

    private loadSubmarineAsync(): Promise<THREE.GLTF> {
        let gltfLoader = new THREE.GLTFLoader();
        return new Promise<THREE.GLTF>((resolve, reject) => {
            try {
                gltfLoader.load("assets/models/submarine/scene.gltf", (gltf) => {
                    gltf.scene.scale.set(0.25, 0.25, 0.25);
                    gltf.scene.position.setY(-1);
                    resolve(gltf);
                }, undefined, err => reject(err.error));
            } catch (err) {
                reject(err as Error);
            }
        });
    }

    private createVesselObjects(): [THREE.Mesh, THREE.Object3D] {

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
        // Attach child component(s)
        this._navigation.attach(ownerDocument, parent, gameStyle, middleware);
    }

    protected onDetaching() {
        // Detach child component(s)
        this._navigation.detach();
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
        // Try to remove camera pivot from the vessel obj
        if (this._removeCameraFromVessel) {
            this._removeCameraFromVessel();
        }
    }

    private get isMidAnimation(): boolean {
        return (!!this._rotationClock || !!this._movementClock);
    }

    private get hasQueuedAnimation(): boolean {
        return (!!this._gameAnimationQueue.length);
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
        // If the new animation type is a correction, we want to scrap all other non-correction animations ahead of it
        if (animationType == "correctVesselPosition") {
            // Find index of last queued "correction" game animation
            let corrections = this._gameAnimationQueue
                .map(x => x.type == "correctVesselPosition");
            let mostRecentCorrection = corrections.lastIndexOf(true);
            // Remove everything afterward
            this._gameAnimationQueue.splice(mostRecentCorrection);
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

    private getVesselVector3(vessel?: IVesselDto | null): THREE.Vector3 {
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
        // Create a corresponding revert method to remove the camera later
        this._removeCameraFromVessel = () => {
            renderingContext.detachCameraFromObject(this._vesselPivot);
        }
        // Set flag for initial rendering
        this._gameNeedsReset = true;
        // Proceed with normal render
        this.onRender(renderingContext);
    }

    protected onRender(renderingContext: IRenderingContext) {
        // Replace the temp vessel object with loaded asset(s)
        if (this._tempVesselNeedsReplace) {
            this.replaceTempVessel(renderingContext);
        }
        // Animate vessel (if loaded)
        if (this._loadedVessel) {
            this.animateVessel(renderingContext);
        }
        // Synchronize with current game state by queueing movement animation(s)
        let correctPosition = false;
        if (this._gameNeedsReset) {
            this.resetGame(renderingContext);
        }
        // Collect keyboard input (for new animation/movement requests)
        let left = false;
        let right = false;
        let forward = false;
        let ignoreKeyboard =
            this._waitingOnMovementRequest ||
            this.isMidAnimation ||
            this.hasQueuedAnimation;
        if (ignoreKeyboard) {
            left = false;
            right = false;
            forward = false;
        } else {
            let keyboardInput = this.getKeyboardInput(renderingContext.keyboard);
            left = keyboardInput["0"];
            right = keyboardInput["1"];
            forward = keyboardInput["2"];
        }
        // If we are not mid-animation or waiting on a movement request, but we do have a queued animation...
        let startQueuedAnimation = !this._waitingOnMovementRequest && !this.isMidAnimation && this.hasQueuedAnimation;
        if (startQueuedAnimation) {
            // Set flags from the queued animation 
            let nextAnimation = <GameAnimation>this.dequeueNextAnimation();
            if (nextAnimation && nextAnimation.type == 'rotateVesselCounterClockwise') {
                left = true;
            }
            if (nextAnimation && nextAnimation.type == 'rotateVesselClockwise') {
                right = true;
            }
            if (nextAnimation && nextAnimation.type == 'moveVesselForward') {
                forward = true;
            }
            if (nextAnimation && nextAnimation.type == 'correctVesselPosition') {
                correctPosition = true;
            }
        }
        // Create rotation animation target data to be applied on next render loop
        if (left || right) {
            this.rotate(renderingContext, left, right);
        }
        // Create forward movement target data to be applied on next render loop
        if (forward || correctPosition) {
            this.move(renderingContext, forward, correctPosition);
        }
        // Apply current movement animation
        this.applyVesselMovement(renderingContext);
        // Apply current rotation animation
        this.applyVesselRotation(renderingContext);
    }

    private getKeyboardInput(keyboardWatcher: KeyboardWatcher): [boolean, boolean, boolean] {
        if (!keyboardWatcher) {
            return [false, false, false];
        }
        let leftIsDown = keyboardWatcher.leftArrowIsDown();
        let rightIsDown = keyboardWatcher.rightArrowIsDown();
        let aIsDown = keyboardWatcher.aIsDown();
        let dIsDown = keyboardWatcher.dIsDown();
        let upArrowIsDown = keyboardWatcher.upArrowIsDown();
        let wIsDown = keyboardWatcher.wIsDown();
        let left = leftIsDown || aIsDown;
        let right = rightIsDown || dIsDown;
        let rotate = (left && !right) || (right && !left); // Rotation only triggers if left/right not cancelling each other out
        if (!rotate) {
            left = false;
            right = false;
        }
        let forward = !rotate && (upArrowIsDown || wIsDown); // Rotation takes precedence over forward movement
        return [left, right, forward];
    }

    private replaceTempVessel(renderingContext: IRenderingContext) {
        // Remove flag
        this._tempVesselNeedsReplace = false;
        // Make sure we actually have a vessel
        if (!this._loadedVessel) {
            throw new Error("Flag was set to replace temp vessel before assets were finished loading!");
        }
        // Remove the temp vessel object from the pivot
        this._vesselPivot.remove(this._tempVessel);
        // TODO: Fix this hack 
        setTimeout(() => this._vesselPivot.add(this._loadedVessel!.scene), 1000);
    }

    private resetGame(renderingContext: IRenderingContext) {

        // Remove flag
        this._gameNeedsReset = false;

        // Check if we changed games
        let currentGame = renderingContext.app.currentGame;
        let currentGameId = currentGame && currentGame.id || "";
        if (currentGameId != (this._gameResetForId || "")) {
            // Store the game id
            this._gameResetForId = currentGameId || null;
            // Reset rotation according to the new game's board
            this.resetRotationsForBoard(currentGame && currentGame.board);
            // Set initial orientation for the vessel
            this.resetVesselRotation();
            // Move vessel back to origin (or whatever starting position)
            this.queueNewAnimation("correctVesselPosition");
            // Don't need to do anything else on new game
            return;
        }

        // If we did not change games but we still don't have a game / vessel
        let currentVessel = renderingContext.app.currentVessel;
        if (!currentGame || !currentVessel) {
            // Nothing else we can really do
            return;
        }

        // Check if app state and current vessel position are not in sync
        let vesselShouldBeHereV3 = this.getVesselVector3(currentVessel);
        if (!vesselShouldBeHereV3.equals(this._vesselPivot.position)) {
            // Correct the vessel position
            this.queueNewAnimation("correctVesselPosition");
            return;
        }

    }

    private resetRotationsForBoard(board: IBoardDto | null) {
        this._rotationRadians = RenderingConstants.SIXTH_TURN_RADIANS;
        let tileShape = board && board.tileShape || BallastAppConstants.TILE_SHAPE_OCTAGON;
        switch (tileShape) {
            case BallastAppConstants.TILE_SHAPE_SQUARE:
                this._rotationRadians = RenderingConstants.QUARTER_TURN_RADIANS;
                break;
            case BallastAppConstants.TILE_SHAPE_OCTAGON:
                this._rotationRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
                break;
            default:
                break;
        }
    }

    private resetVesselPosition(targetPosition?: THREE.Vector3) {
        if (!targetPosition) {
            this._vesselPivot.position.set(0, 0, 0);
        } else {
            this._vesselPivot.position.fromArray(targetPosition.toArray());
            this._movementTarget.position.fromArray(targetPosition.toArray());
        }
    }

    private resetVesselRotation() {
        // Set initial orientation for the vessel
        let initialY = RenderingConstants.INITIAL_ORIENTATION_RADIANS;
        this._vesselPivot.rotation.set(0, initialY, 0);
        this._rotationTarget.rotation.set(0, initialY, 0);
    }

    private animateVessel(renderingContext: IRenderingContext) {
        if (!this._loadedVessel) {
            return;
        }
        // TODO: fix this to use sinusoidal movement
        if (this._vesselAnimateX <= 0) {
            this._loadedVessel.scene.position.x += 0.001;
            this._vesselAnimateX++;
        }
        if (this._vesselAnimateX > 0) {
            this._loadedVessel.scene.position.x -= 0.001;
            this._vesselAnimateX++;
        }
        if (this._vesselAnimateX > 100) {
            this._vesselAnimateX = -99;
        }
        if (this._vesselAnimateY <= 0) {
            this._loadedVessel.scene.position.y += 0.005;
            this._vesselAnimateY++;
        }
        if (this._vesselAnimateY > 0) {
            this._loadedVessel.scene.position.y -= 0.005;
            this._vesselAnimateY++;
        }
        if (this._vesselAnimateY > 50) {
            this._vesselAnimateY = -49;
        }
        if (this._vesselAnimateZ <= 0) {
            this._loadedVessel.scene.position.z += 0.003;
            this._vesselAnimateZ++;
        }
        if (this._vesselAnimateZ > 0) {
            this._loadedVessel.scene.position.z -= 0.003;
            this._vesselAnimateZ++;
        }
        if (this._vesselAnimateZ > 25) {
            this._vesselAnimateZ = -24;
        }
    }

    private move(renderingContext: IRenderingContext, forward: boolean, correction: boolean) {

        // Get current vessel Vector3
        let currentV3 = this._vesselPivot.position;

        // Sync vessel pivot v3 with app context vessel coordinates
        if (correction) {
            let targetV3 = this.getVesselVector3(renderingContext.app.currentVessel);
            if (!currentV3.equals(targetV3)) {
                this.startVesselMovementAnimation(currentV3, targetV3);
            }
        }

        // Ask server to perform forward movement and get resulting position
        if (forward) {
            // Set flag so that we don't try any other animations until this one finishes
            this._waitingOnMovementRequest = true;
            // Get new position (async)
            this.requestMoveForwardAsync(renderingContext, currentV3)
                .then(targetV3 => {
                    if (!currentV3.equals(targetV3)) {
                        this.startVesselMovementAnimation(currentV3, targetV3);
                    }
                    return Promise.resolve();
                })
                .catch(err => console.log(err))
                .then(() => {
                    // Remove flag so new animations can be queued in render loop
                    this._waitingOnMovementRequest = false;
                    return Promise.resolve();
                });
        }

    }

    private startVesselMovementAnimation(currentPosition: THREE.Vector3, targetPosition: THREE.Vector3, isCorrection: boolean = false) {
        this._movementClock = new THREE.Clock();
        this._movementSource.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
        this._movementTarget.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        this._movementAnimationDuration = isCorrection ? RenderingConstants.CORRECTION_DURATION_SECONDS : RenderingConstants.MOVEMENT_DURATION_SECONDS;
    }

    private endVesselMovementAnimation(finalPosition: THREE.Vector3) {
        this._movementClock = undefined;
        this._movementSource.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
        this._movementTarget.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
        this._movementAnimationDuration = RenderingConstants.MOVEMENT_DURATION_SECONDS;
    }

    private rotate(renderingContext: IRenderingContext, left: boolean, right: boolean) {
        if (right || left) {
            let rotationRadians = this._rotationRadians;
            this.startVesselRotationAnimation(rotationRadians, left);
        }
    }

    private startVesselRotationAnimation(rotationRadians: number, counterClockwise: boolean = false, isCorrection: boolean = false) {
        this._rotationClockwise = !counterClockwise;
        let thetaRadians = rotationRadians;
        if (this._rotationClockwise)
            thetaRadians *= -1;
        this._rotationClock = new THREE.Clock();
        this._rotationTarget.rotateY(thetaRadians);
        this._rotationAnimationDuration = isCorrection ? RenderingConstants.CORRECTION_DURATION_SECONDS : RenderingConstants.PIVOT_DURATION_SECONDS;
    }

    private endVesselRotationAnimation() {
        this._rotationClock = undefined;
        this._rotationAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
    }

    private async requestMoveForwardAsync(renderingContext: IRenderingContext, currentVesselVector3?: THREE.Vector3): Promise<THREE.Vector3> {
        // Check current props to see if it's okay to proceed with movement request
        let vessel = renderingContext.app.currentVessel;
        if (!vessel) {
            return new THREE.Vector3(0, 0, 0);
        }
        let player = renderingContext.app.currentPlayer;
        let game = renderingContext.app.currentGame;
        let isCaptain = !!renderingContext.app.currentVesselRoles.find(x => x == BallastAppConstants.VESSEL_ROLE_CAPTAIN);
        // Can't move forward if player is not the captain of a vessel within the current game
        if (!player || !game || !isCaptain) {
            return currentVesselVector3 || this.getVesselVector3(vessel); // Just return current coordinates as v3
        }
        // Create a delayed movement request
        let vesselDirection = renderingContext.cameraTracker.getDirection(game.board.tileShape, this._vesselPivot);
        vessel = await this._gameService.moveVesselAsync({
            gameId: game.id,
            vesselId: vessel.id,
            sentOnDateIsoString: new Date(Date.now()).toISOString(),
            sourceOrderedTriple: vessel.orderedTriple,
            targetOrderedTriple: [],
            direction: vesselDirection
        });
        return this.getVesselVector3(vessel); // Convert vessel coordinates to v3
    }

    private applyVesselMovement(renderingContext: IRenderingContext) {

        // Determine if we are mid-movement
        let midMovement = !!this._movementClock;

        // Get time since last movement adjustment (if applicable)
        let movementDelta = 0;
        if (midMovement) {
            movementDelta = this._movementClock!.getDelta();
        }

        // If we need to adjust for seconds elapsed while mid-orbit
        if (movementDelta <= 0) {
            return;
        }

        // Check if we have reached the end of the movement animation (time)
        let totalMovementDelta = this._movementClock!.getElapsedTime();
        if (totalMovementDelta < this._movementAnimationDuration) {

            // Calculate how far into the movement animation we are (%)
            let partialMovementPercentage = totalMovementDelta / this._movementAnimationDuration;

            // Clone the beginning (source) of forward movement to use as the start of linear interpolation
            let nextPosition = this._movementSource.clone()
                .position.lerp(this._movementTarget.position, partialMovementPercentage);

            // Move the vessel pivot along the track (set to lerp'd position)
            this._vesselPivot.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

        } else {

            // Move directly to final position
            this._vesselPivot.position.set(
                this._movementTarget.position.x,
                this._movementTarget.position.y,
                this._movementTarget.position.z
            );

            // finished movement
            this.endVesselMovementAnimation(this._movementTarget.position);

        }

    }

    private applyVesselRotation(renderingContext: IRenderingContext) {

        // Determine if we are mid-rotation
        let midRotation = !!this._rotationClock;

        // Get time since last orbit adjustment (if applicable)
        let rotationDelta = 0;
        if (midRotation) {
            rotationDelta = this._rotationClock!.getDelta();
        }

        // If we need to adjust for seconds elapsed while mid-orbit
        if (rotationDelta <= 0) {
            return;
        }

        // Check if we have reached the end of the rotation animation (time)
        let totalOrbitDelta = this._rotationClock!.getElapsedTime();
        if (totalOrbitDelta < this._rotationAnimationDuration) {

            // Calculate how much of a partial turn we need to rotate by
            let partialTurns = rotationDelta * (1 / this._rotationAnimationDuration);

            // Convert partial turns to radians
            let thetaRadians = partialTurns * this._rotationRadians;
            if (this._rotationClockwise)
                thetaRadians *= -1;

            // Rotate our vessel pivot object
            this._vesselPivot.rotateY(thetaRadians);

        } else {

            // Move directly to final orientation
            this._vesselPivot.rotation.setFromVector3(
                this._rotationTarget.rotation.toVector3()
            );

            // finished rotating
            this.endVesselRotationAnimation();
            renderingContext.app.refreshDirectionAsync(renderingContext.cameraTracker)
                .catch(err => console.log(err)); // Fire and forget (but catch exceptions)

        }

    }

    private onRotateVesselClockwiseButtonClickAsync() {
        this.queueNewAnimation('rotateVesselClockwise');
    }

    private onRotateVesselCounterClockwiseButtonClickAsync() {
        this.queueNewAnimation('rotateVesselCounterClockwise');
    }

    private onMoveVesselForwardButtonClickAsync() {
        this.queueNewAnimation('moveVesselForward');
    }

    private onCurrentGameModifiedAsync() {
        this._gameNeedsReset = true;
        return Promise.resolve();
    }

    private onCurrentVesselModifiedAsync() {
        this._gameNeedsReset = true;
        return Promise.resolve();
    }

}