export interface IAddPlayerOptions {
    playerId: string;
    playerName: string | null;
    gameId: string;
    vesselId: string | null;
    vesselRoleValues: number[];
}