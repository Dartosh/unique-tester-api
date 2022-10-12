import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import { GoogleSheetHeaderInterface, GoogleSheetInterface } from '../interfaces/google-sheet-structure.interface';
export declare class GoogleSpreadsheetBuilder implements GoogleSheetInterface {
    readonly tableHeaders: GoogleSheetHeaderInterface[];
    setColumnHeader(header: GoogleSheetHeaderInterface): void;
    getHeaderByType(type: GoogleSheetHeaderTypeEnum): GoogleSheetHeaderInterface;
}
