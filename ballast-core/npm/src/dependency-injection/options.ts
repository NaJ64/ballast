import { IDomainGameServiceOptions } from "../application/services/impl/domain-game-service"

export interface IBallastCoreOptions extends IDomainGameServiceOptions {
    useDomain: boolean;
    useLocalEventBus: boolean;
}

export class BallastCoreOptions implements IBallastCoreOptions { 

    public useDomain: boolean;
    public useLocalEventBus: boolean;
    public defaultBoardType: string | null;
    public defaultTileShape: string | null;
    public defaultBoardSize: number | null;
    public defaultLandToWaterRatio: number | null;
    public defaultVessels: string[] | null;

    public constructor() {
        this.useDomain = true;
        this.useLocalEventBus = true;
        this.defaultBoardType = null;
        this.defaultTileShape = null;
        this.defaultBoardSize = null;
        this.defaultLandToWaterRatio = null;
        this.defaultVessels = [];
    }
    
}