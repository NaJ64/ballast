export interface IVesselDto {
    id: string;
    name: string;
    orderedTriple: number[];
    captainId: number | null;
    captainName: string | null;
    radiomanId: number | null;
    radiomanName: string | null;
}