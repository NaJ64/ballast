export interface IPlayerSignInRequest {
    playerId: string;
    playerName: string | null;
    sentOnDateIsoString: string;
}