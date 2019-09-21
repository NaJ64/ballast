import { RenderingConstants } from "./rendering-constants";

export abstract class RenderingUtilities {

    private constructor() { }
    
    public static toOffsetCoordinates(orderedTriple: number[]){
        if (!orderedTriple || !Array.isArray(orderedTriple) || orderedTriple.length < 3) {
            throw new Error("Cannot convert ordered triple to offset coordinates");
        }
        let x = orderedTriple[0];
        //let y = orderedTriple[1];
        let z = orderedTriple[2];
        // Bitwise AND (& 1) to get 0 for even or 1 for odd column offset
        let col = x + (z - (z & 1)) / 2;
        let row = z;
        return { col: col, row: row };
    }

    public static to3dCoordinates(orderedTriple: number[], doubleIncrement: boolean, applyHexRowScaling: boolean) {
        const offsetHex = RenderingUtilities.toOffsetCoordinates(orderedTriple);
        let x = offsetHex.col;
        let z = offsetHex.row;
        if ((z & 1) > 0) {
            x += 0.5;
        }
        let colSpacing = RenderingConstants.TILE_POSITION_SCALAR;
        if (doubleIncrement) {
            colSpacing *= 0.5;
        }
        let rowSpacing = colSpacing;
        if (applyHexRowScaling) {
            rowSpacing *= RenderingConstants.HEX_ROW_SCALAR;
        }
        x *= colSpacing;
        z *= rowSpacing;
        return {
            x, 
            z
        };
    }

}