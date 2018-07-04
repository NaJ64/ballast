export interface IChatMessage {
    gameId: string | null;
    channel: string;
    fromPlayerId: string;
    fromPlayerName?: string;
    text: string;
    isoDateTime: string;
}
