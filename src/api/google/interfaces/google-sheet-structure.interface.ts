import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';

export interface GoogleSheetHeaderInterface {
  name: string;

  type: GoogleSheetHeaderTypeEnum;

  xCoord: number;

  yCoord: number;

  setXCoord(xCoord: number): GoogleSheetHeaderInterface;

  setYCoord(yCoord: number): GoogleSheetHeaderInterface;
}

export interface GoogleSheetInterface {
  tableValues: any;

  tableHeaders: GoogleSheetHeaderInterface[];

  setColumnHeaders(headers: GoogleSheetHeaderInterface[]): GoogleSheetInterface;

  getHeaderByType(type: GoogleSheetHeaderTypeEnum): GoogleSheetHeaderInterface;
}
