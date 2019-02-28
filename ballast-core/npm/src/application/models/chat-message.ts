export interface IChatMessage {
    gameId: string | null;
    channel: string;
    fromPlayerId: string;
    fromPlayerName: string | null;
    text: string;
    sentOnDateIsoString: string;
}
