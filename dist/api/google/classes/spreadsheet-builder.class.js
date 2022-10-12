"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSpreadsheetBuilder = void 0;
class GoogleSpreadsheetBuilder {
    setColumnHeader(header) {
        this.tableHeaders.push(header);
    }
    getHeaderByType(type) {
        return this.tableHeaders.find((header) => header.type === type);
    }
}
exports.GoogleSpreadsheetBuilder = GoogleSpreadsheetBuilder;
//# sourceMappingURL=spreadsheet-builder.class.js.map