import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';

export interface GoogleSheetHeaderInterface {
  name: string;

  type: GoogleSheetHeaderTypeEnum;

  xCoord: number;

  yCoord: number;
}

export interface GoogleSheetInterface {
  tableHeaders: GoogleSheetHeaderInterface[];

  setColumnHeader(header: GoogleSheetHeaderInterface): void;

  getHeaderByType(type: GoogleSheetHeaderTypeEnum): GoogleSheetHeaderInterface;
}
