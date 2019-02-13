import { inject, injectable } from "inversify";
import { TYPES as BallastCore } from "../../../dependency-injection/types";
import { IEventBus } from "../../../messaging/event-bus";
import { IApplicationEventEmitter } from "../application-event-emitter";

@injectable()
export class DomainApplicationEventEmitter implements IApplicationEventEmitter {

    private readonly _eventBus: IEventBus;
    private _isEnabled: boolean;

    public constructor(
        @inject(BallastCore.Messaging.IEventBus) eventBus: IEventBus
    ) {
        this._eventBus = eventBus;
        this._isEnabled = false;
    }
    
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    public startAsync(): Promise<void> {
        this._isEnabled = true;
        throw new Error("Method not implemented.");
    }

    public stopAsync(): Promise<void> {
        this._isEnabled = false;
        throw new Error("Method not implemented.");
    }

}