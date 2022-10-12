import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import {
  GoogleSheetHeaderInterface,
  GoogleSheetInterface,
} from '../interfaces/google-sheet-structure.interface';

export class GoogleSpreadsheetBuilder implements GoogleSheetInterface {
  public readonly tableHeaders: GoogleSheetHeaderInterface[];

  public setColumnHeader(header: GoogleSheetHeaderInterface): void {
    this.tableHeaders.push(header);
  }

  public getHeaderByType(type: GoogleSheetHeaderTypeEnum) {
    return this.tableHeaders.find((header) => header.type === type);
  }
}
