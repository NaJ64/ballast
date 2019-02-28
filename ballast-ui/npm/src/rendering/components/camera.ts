import { IEventBus, TYPES as BallastCore } from "ballast-core";
import { inject, injectable } from "inversify";
import * as THREE from "three";
import { CurrentDirectionModifiedEvent } from "../../events/current-direction-modified";
import { CurrentGameModifiedEvent } from "../../events/current-game-modified";
import { CurrentPlayerModifiedEvent } from "../../events/current-player-modified";
import { CurrentVesselModifiedEvent } from "../../events/current-vessel-modified";
import { CurrentVesselRolesModifiedEvent } from "../../events/current-vessel-roles-modified";
import { RenderingComponentBase } from "../rendering-component";
import { IRenderingContext } from "../rendering-context";

@injectable()
export class CameraComponent extends RenderingComponentBase {

    private readonly _eventBus: IEventBus;
    private readonly _cameraPosition: THREE.Vector3;
    private _cameraNeedsReset: boolean;
    private _cameraResetForGameId: string | null;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        super();
        this.rebindHandlers();
        this._eventBus = eventBus;
        this._cameraPosition = new THREE.Vector3();
        this._cameraResetForGameId = null;
        this._cameraNeedsReset = false;
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

    private updateCamera(newOrbitRadius: number, newOrbitHeight: number) {
        this._cameraPosition.set(0, newOrbitHeight, newOrbitRadius);
    }

    protected onAttached() {
        // Subscribe to all application events
        this.subscribeAll();
    }

    protected onDetaching() {
        // Unsubscribe from all application events
        this.unsubscribeAll();
    }

    protected onFirstRender(renderingContext: IRenderingContext) {
        this._cameraNeedsReset = true;
        this.onRender(renderingContext);
    }

    protected onRender(renderingContext: IRenderingContext) {
        // Check if we need to reset camera for the current game
        if (this._cameraNeedsReset) {
            this.resetCamera(renderingContext);
        }
    }

    private resetCamera(renderingContext: IRenderingContext) {
        // Remove flag
        this._cameraNeedsReset = false;
        // Check if we changed game(s)
        let currentGameId = renderingContext.app.currentGame && renderingContext.app.currentGame.id || "";
        if (currentGameId == (this._cameraResetForGameId || "")) {
            return; // Do nothing
        }
        // Reset camera pivot and orbit target
        renderingContext.threeCameraPivot.rotation.set(0, 0, 0);
        // Store new orbit radians for future animations
        let game = renderingContext.app.currentGame;
        if (!game) {
            this._cameraResetForGameId = null;
            return; // Nothing else we can do
        } else {
            this._cameraResetForGameId = game.id;
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

    private onCurrentDirectionModifiedAsync() {
        this._cameraNeedsReset = true;
        return Promise.resolve();
    }

    private onCurrentGameModifiedAsync() {
        this._cameraNeedsReset = true;
        return Promise.resolve();
    }

    private onCurrentPlayerModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }

    private onCurrentVesselModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }

    private onCurrentVesselRolesModifiedAsync() {
        // Do something here
        return Promise.resolve();
    }

}