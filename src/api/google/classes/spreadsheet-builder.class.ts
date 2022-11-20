import { GoogleDocumentFieldsEnum } from '../enum/google-doc-metadata-fields.enum';
import { GoogleSheetHeaderTypeEnum } from '../enum/google-sheet-header-type.enum';
import { GoogleDocumentMetadataInterface } from '../interfaces/google-doc-metadata.interface';
import {
  GoogleSheetHeaderInterface,
  GoogleSheetInterface,
} from '../interfaces/google-sheet-structure.interface';
import { DocumentMetadata } from './document-metadata.class';

export class GoogleSpreadsheetBuilder implements GoogleSheetInterface {
  public readonly tableHeaders: GoogleSheetHeaderInterface[];

  public tableValues: string[][];

  constructor(tableValues: any) {
    this.tableValues = tableValues;
    this.tableHeaders = [];
  }

  private getDocumentId(documentLink: string): string {
    return documentLink.split('/')[5];
  }

  public setColumnHeaders(headers: GoogleSheetHeaderInterface[]) {
    this.tableHeaders.push(...headers);

    this.tableHeaders.forEach((tableHeader) => {
      const lowercasedHeaderName = tableHeader.name.toLowerCase();

      let isFounded = false;

      this.tableValues.forEach((tableLineValues, lineIndex) => {
        tableLineValues.forEach((tableLineValue, columnIndex) => {
          const lowercasedLineValue = tableLineValue.toLowerCase();

          if (
            lowercasedLineValue.includes(lowercasedHeaderName) &&
            !isFounded
          ) {
            tableHeader.setXCoord(columnIndex).setYCoord(lineIndex);

            isFounded = true;
          }
        });
      });
    });

    return this;
  }

  public getGoogleDocuments(
    from?: number,
    to?: number,
  ): GoogleDocumentMetadataInterface[] {
    const counter = {
      from: 1,
      to: 10,
    };

    if (from && to) {
      counter.from =
        from > 0 && from < this.tableValues.length && from < to
          ? counter.from
          : this.getHeaderByType(GoogleSheetHeaderTypeEnum.documentLink)
              .yCoord + 1;

      counter.to =
        to > 0 && to < this.tableValues.length && to > from
          ? counter.to
          : this.tableValues.length - 1;
    }

    const documentsToReturn: DocumentMetadata[] = [];

    for (let i = from; i <= to; i += 1) {
      const documentLinkCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.documentLink,
      );

      if (!documentLinkCell) {
        continue;
      }

      const documentTitleCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.documentTitle,
      );

      const checkStatusCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.checkStatus,
      );

      if (checkStatusCell.name !== '1') {
        checkStatusCell.name = '0';
      }

      const textRuResultCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.textRuResult,
      );

      const eTextResultCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.eTextResult,
      );

      const wordsCountCell = this.getDocumentCell(
        i,
        GoogleSheetHeaderTypeEnum.wordsCount,
      );

      const documentMetadata = new DocumentMetadata(
        this.getGoogleIdFromLink(documentLinkCell.name),
        checkStatusCell.name,
        documentTitleCell.name,
        wordsCountCell.name,
        documentLinkCell.name,
        textRuResultCell.name,
        eTextResultCell.name,
      )
        .setCellCoords(
          checkStatusCell.xCoord,
          checkStatusCell.yCoord,
          GoogleDocumentFieldsEnum.checkStatusCoords,
        )
        .setCellCoords(
          documentTitleCell.xCoord,
          documentTitleCell.yCoord,
          GoogleDocumentFieldsEnum.documentTitleCoords,
        )
        .setCellCoords(
          wordsCountCell.xCoord,
          wordsCountCell.yCoord,
          GoogleDocumentFieldsEnum.wordsCountCoords,
        )
        .setCellCoords(
          documentLinkCell.xCoord,
          documentLinkCell.yCoord,
          GoogleDocumentFieldsEnum.documentLinkCoords,
        )
        .setCellCoords(
          textRuResultCell.xCoord,
          textRuResultCell.yCoord,
          GoogleDocumentFieldsEnum.textRuResultCoords,
        )
        .setCellCoords(
          eTextResultCell.xCoord,
          eTextResultCell.yCoord,
          GoogleDocumentFieldsEnum.eTextResultCoords,
        );

      documentsToReturn.push(documentMetadata);
    }

    return documentsToReturn;
  }

  public getHeaderByType(
    type: GoogleSheetHeaderTypeEnum,
  ): GoogleSheetHeaderInterface {
    return this.tableHeaders.find((header) => header.type === type);
  }

  private getGoogleIdFromLink(link: string): string {
    return link.split('/')[5];
  }

  private getDocumentCell(index: number, header: GoogleSheetHeaderTypeEnum) {
    const currentHeader = this.getHeaderByType(header);

    return {
      name:
        this.tableValues[currentHeader.yCoord + index] &&
        this.tableValues[currentHeader.yCoord + index][currentHeader.xCoord]
          ? this.tableValues[currentHeader.yCoord + index][currentHeader.xCoord]
          : '',
      xCoord: currentHeader.xCoord,
      yCoord: currentHeader.yCoord + index,
    };
  }
}
