import { IGameDto, IPlayerDto } from "ballast-core";

export interface IApplicationContext {
    readonly player: IPlayerDto | null;
    readonly game: IGameDto | null;
}

export class ApplicationContext implements IApplicationContext {

    private readonly _game: IGameDto | null;
    private readonly _player: IPlayerDto | null;

    public constructor() {
        this._game = null;
        this._player = null;
    }

    public get game(): IGameDto | null {
        return this._game || null;
    }

    public get player(): IPlayerDto | null {
        return this._player || null;
    }

}