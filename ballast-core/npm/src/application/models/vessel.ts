export interface IVesselDto {
    id: string;
    name: string;
    orderedTriple: number[];
    captainId: string | null;
    captainName: string | null;
    radiomanId: string | null;
    radiomanName: string | null;
}