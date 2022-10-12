import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import { GoogleSheetHeaderInterface } from '../interfaces/google-sheet-structure.interface';
export declare class SpreadSheetHeader implements GoogleSheetHeaderInterface {
    readonly name: string;
    readonly type: GoogleSheetHeaderTypeEnum;
    readonly xCoord: number;
    readonly yCoord: number;
    constructor(name: string, type: GoogleSheetHeaderTypeEnum, xCoord: number, yCoord: number);
}
