import { IBoardSpace, BoardSpace } from './board-space';
import { IBoardType, BoardType } from './board-type';
import { IVessel, Vessel } from './vessel';

export interface IBoard {
    type: IBoardType;
    spaces: IBoardSpace[];
    rows: IBoardSpace[][];
    columns: IBoardSpace[][];
    vessels: IVessel[];
    inactiveVessels: IVessel[];
    activeVessels: IVessel[];
    rowCount: number;
    columnCount: number;
}

export class Board implements IBoard {

    public type!: BoardType;
    public spaces!: BoardSpace[];
    public rows!: BoardSpace[][];
    public columns!: BoardSpace[][];
    public vessels!: Vessel[];
    public inactiveVessels!: Vessel[];
    public activeVessels!: Vessel[];
    public rowCount!: number;
    public columnCount!: number;

    public constructor(data: IBoard) {
        if (data) {
            this.hydrate(data);
        }
    }

    public hydrate(data: IBoard) {
        this.type = BoardType.fromValue(data.type.value);
        this.spaces = [];
        for(let spaceData of data.spaces)
        {
            this.spaces.push(new BoardSpace(spaceData));
        }
        let spaces = this.spaces.slice(0);
        for(let space of this.spaces) {
            space.setAdjacents(spaces);
        }
        for(let space of data.spaces)
        {
            this.spaces.push(new BoardSpace(space));
        }
        this.rows = this.groupRows(this.spaces);
        this.columns = this.groupColumns(this.spaces);
        return this;
    }

    private groupRows(spaces: BoardSpace[]): BoardSpace[][] {
        let rows = spaces.reduce((rowGroups: BoardSpace[][], nextSpace: BoardSpace) => {
            let groupKey = nextSpace.coordinates.row;
            if (!rowGroups || rowGroups.length < 1) {
                rowGroups.push([nextSpace]);
            } else {
                let existingGroup = rowGroups.find(group =>
                    group[0].coordinates.row === (nextSpace.coordinates.row || "")
                )
                if (existingGroup) {
                    existingGroup.push(nextSpace);
                } else {
                    rowGroups.push([nextSpace]);
                }
            }
            return rowGroups;
        }, []);
        return rows;
    }

    private groupColumns(spaces: BoardSpace[]): BoardSpace[][] {
        let columns = spaces.reduce((columnGroups: BoardSpace[][], nextSpace: BoardSpace) => {
            let groupKey = nextSpace.coordinates.column;
            if (!columnGroups || columnGroups.length < 1) {
                columnGroups.push([nextSpace]);
            } else {
                let existingGroup = columnGroups.find(group =>
                    group[0].coordinates.column === (nextSpace.coordinates.column || "")
                )
                if (existingGroup) {
                    existingGroup.push(nextSpace);
                } else {
                    columnGroups.push([nextSpace]);
                }
            }
            return columnGroups;
        }, []);
        return columns;
    }

}