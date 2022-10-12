import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import { GoogleSheetHeaderInterface } from '../interfaces/google-sheet-structure.interface';

export class SpreadSheetHeader implements GoogleSheetHeaderInterface {
  public readonly name: string;
  public readonly type: GoogleSheetHeaderTypeEnum;
  public readonly xCoord: number;
  public readonly yCoord: number;

  constructor(
    name: string,
    type: GoogleSheetHeaderTypeEnum,
    xCoord: number,
    yCoord: number,
  ) {
    this.name = name;
    this.type = type;
    this.xCoord = xCoord;
    this.yCoord = yCoord;
  }
}
