import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import { GoogleSheetHeaderInterface } from '../interfaces/google-sheet-structure.interface';

export class SpreadsheetHeader implements GoogleSheetHeaderInterface {
  public readonly name: string;
  public readonly type: GoogleSheetHeaderTypeEnum;
  public xCoord: number;
  public yCoord: number;

  constructor(name: string, type: GoogleSheetHeaderTypeEnum) {
    this.name = name;
    this.type = type;
  }

  setXCoord(xCoord: number): GoogleSheetHeaderInterface {
    this.xCoord = xCoord;

    return this;
  }

  setYCoord(yCoord: number): GoogleSheetHeaderInterface {
    this.yCoord = yCoord;

    return this;
  }
}
