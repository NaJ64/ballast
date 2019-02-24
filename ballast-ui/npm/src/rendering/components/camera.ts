import { IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import * as THREE from "three";
import { BallastAppConstants } from "../../app-constants";
import { CurrentDirectionModifiedEvent } from "../../events/current-direction-modified";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentPlayerModifiedEvent } from "../../events/current-player-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";
import { CurrentVesselRolesModifiedEvent } from "../../events/current-vessel-roles-modified";
import { RenderingComponentBase } from "../rendering-component";
import { RenderingConstants } from "../rendering-constants";
import { IRenderingContext } from "../rendering-context";

@injectable()
export class CameraComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private readonly _cameraPosition: THREE.Vector3;
    private readonly _orbitTarget: THREE.Object3D;
    private readonly _orbitAnimationDuration: number;
    private _cameraNeedsReset: boolean;
    private _cameraResetForGameId: string | null;
    private _orbitRadians: number;
    private _orbitClock?: THREE.Clock;
    private _orbitClockwise?: boolean;
    private _triggerClockwiseOrbit?: number;
    private _triggerCounterClockwiseOrbit?: number;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._cameraPosition = new THREE.Vector3();
        this._cameraResetForGameId = null;
        this._cameraNeedsReset = true;
        this._orbitTarget = this.createOrbitTarget();
        this._orbitAnimationDuration = RenderingConstants.PIVOT_DURATION_SECONDS;
        this._orbitRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default
    }

    protected onDisposing() {
        this.unsubscribeAll();
    }

    private rebindHandlers() {
        this.onCurrentDirectionModifiedAsync = this.onCurrentDirectionModifiedAsync.bind(this);
        this.onCurrentGameModifiedAsync = this.onCurrentGameModifiedAsync.bind(this);
        this.onCurrentPlayerModifiedAsync = this.onCurrentPlayerModifiedAsync.bind(this);
        this.onCurrentVesselModifiedAsync = this.onCurrentVesselModifiedAsync.bind(this);
        this.onCurrentVesselRolesModifiedAsync = this.onCurrentVesselRolesModifiedAsync.bind(this);
    }

    private subscribeAll() {
        this._eventBus.subscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.subscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.subscribe(CurrentPlayerModifiedEvent.id, this.onCurrentPlayerModifiedAsync);
        this._eventBus.subscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
        this._eventBus.subscribe(CurrentVesselRolesModifiedEvent.id, this.onCurrentVesselRolesModifiedAsync);
    }

    private unsubscribeAll() {
        this._eventBus.unsubscribe(CurrentDirectionModifiedEvent.id, this.onCurrentDirectionModifiedAsync);
        this._eventBus.unsubscribe(CurrentGameModifiedEvent.id, this.onCurrentGameModifiedAsync);
        this._eventBus.unsubscribe(CurrentPlayerModifiedEvent.id, this.onCurrentPlayerModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselModifiedEvent.id, this.onCurrentVesselModifiedAsync);
        this._eventBus.unsubscribe(CurrentVesselRolesModifiedEvent.id, this.onCurrentVesselRolesModifiedAsync);
    }

    private createOrbitTarget(): THREE.Object3D {
        let cameraOrbitTarget = new THREE.Object3D();
        cameraOrbitTarget.rotation.reorder("YXZ");
        return cameraOrbitTarget;
    }

    private updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this._cameraPosition.set(0, newOrbitHeight, newOrbitRadius);
    }

    protected onAttached() {
        this.subscribeAll();
    }

    protected onDetaching() {
        this.unsubscribeAll();
    }

    protected onRender(renderingContext: IRenderingContext) {
        // Check if we need to reset camera for the current game
        if (this._cameraNeedsReset) {
            this.resetCamera(renderingContext);
        }
        // // Apply orbit animation
        // this.applyOrbit(renderingContext, false, false);
    }

    private resetCamera(renderingContext: IRenderingContext) {
        // Remove flag
        this._cameraNeedsReset = false;
        // Check if we changed game(s)
        let lastResetForGameId = this._cameraResetForGameId || "";
        let currentGameId = renderingContext.app.currentGame && renderingContext.app.currentGame.id || "";
        if (lastResetForGameId == currentGameId) {
            return; // Do nothing
        }
        // Reset camera pivot and orbit target
        renderingContext.threeCameraPivot.rotation.set(0, 0, 0);
        this._orbitTarget.rotation.set(0, 0, 0);
        // Store new orbit radians for future animations
        let game = renderingContext.app.currentGame;
        if (!game) {
            this._cameraResetForGameId = null;
            this._orbitRadians = RenderingConstants.EIGHTH_TURN_RADIANS; // Default
            return; // Nothing else we can do
        } else {
            this._cameraResetForGameId = game.id;
            if (game.board.tileShape == BallastAppConstants.TILE_SHAPE_OCTAGON) {
                this._orbitRadians = RenderingConstants.EIGHTH_TURN_RADIANS;
            } else if (game.board.tileShape == BallastAppConstants.TILE_SHAPE_SQUARE) {
                this._orbitRadians = RenderingConstants.QUARTER_TURN_RADIANS;
            } else {
                this._orbitRadians = RenderingConstants.SIXTH_TURN_RADIANS;
            }
        }
        // Set initial camera height/distance and re-point at subject
        this.updateCamera(10, 5); // TODO: get these values from somewhere else
        if (!renderingContext.threeCamera.position.equals(this._cameraPosition)) {
            renderingContext.threeCamera.position.copy(this._cameraPosition);
            if (renderingContext.threeCamera.parent) {
                renderingContext.threeCamera.lookAt(renderingContext.threeCamera.parent.position);
            }
        }
    }

    private applyOrbit(renderingContext: IRenderingContext, left: boolean, right: boolean) {

        // Determine if we are mid-orbit
        let inOrbit = !!this._orbitClock;

        // Get elapsed time since last orbit adjustment (if applicable)
        let orbitDelta = 0;
        if (inOrbit) {
            orbitDelta = this._orbitClock!.getDelta();
        }

        // Check if we need to trigger a new orbit
        let triggerNewOrbit = !inOrbit && (!right && left || !left && right);
        if (triggerNewOrbit) {
            this._orbitClockwise = left; // Reverse direction
            let thetaRadians = this._orbitRadians;
            if (!this._orbitClockwise) {
                thetaRadians *= -1;
            }
            this._orbitClock = new THREE.Clock();
            this._orbitTarget.rotateY(thetaRadians);
            if (!!this._triggerClockwiseOrbit && !this._orbitClockwise) {
                this._triggerClockwiseOrbit--;
            }
            if (!!this._triggerCounterClockwiseOrbit && this._orbitClockwise) {
                this._triggerCounterClockwiseOrbit--;
            }
        }

        // If we need to adjust for seconds elapsed while in orbit state
        if (orbitDelta > 0) {
            // Check if we have reached the end of the orbit
            let totalOrbitDelta = this._orbitClock!.getElapsedTime();
            if (totalOrbitDelta >= this._orbitAnimationDuration) {
                // Move directly to final orientation
                renderingContext.threeCameraPivot.rotation.setFromVector3(
                    this._orbitTarget!.rotation.toVector3()
                );
                // Finished rotating
                this._orbitClockwise = undefined;
                this._orbitClock = undefined;
            } else {
                // Calculate how much of a partial turn we need to rotate by
                let partialTurns = (1 / this._orbitAnimationDuration) * orbitDelta;
                // Convert partial turns to radians
                let thetaRadians = partialTurns * this._orbitRadians;
                if (!this._orbitClockwise) {
                    thetaRadians *= -1;
                }
                // Rotate the camera pivot object
                renderingContext.threeCameraPivot.rotateY(thetaRadians);
            }
        }
    }

    private async onCurrentDirectionModifiedAsync() {
        this._cameraNeedsReset = true;
    }

    private async onCurrentGameModifiedAsync() {
        this._cameraNeedsReset = true;
    }

    private async onCurrentPlayerModifiedAsync() {
        // Do something here
    }

    private async onCurrentVesselModifiedAsync() {
        // Do something here
    }

    private async onCurrentVesselRolesModifiedAsync() {
        // Do something here
    }

}