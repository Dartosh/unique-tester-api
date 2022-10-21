import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/db';
import { GoogleAuth } from 'googleapis-common';
import { docs_v1, GoogleApis, sheets_v4 } from 'googleapis';

import { googleConfiguration } from 'src/config/google.config';
import { GoogleDocumentBuilder } from './classes/document-builder.class';
import { GoogleDocument } from './interfaces/google-document.interface';
import { SpreadSheetDataDto } from './dto/spreadsheet-data.dto';
import { SpreadsheetHeader } from './classes/spreadsheet-header.class';
import { GoogleSheetHeadersInterface } from './interfaces/google-sheet-headers.interface';
import { GoogleSheetHeaderInterface } from './interfaces/google-sheet-structure.interface';
import { GoogleSheetHeaderTypeEnum } from './enum/google-sheet-header-type.enum';
import { GoogleSpreadsheetBuilder } from './classes/spreadsheet-builder.class';

@Injectable()
export class GoogleService {
  private readonly googleApis: GoogleApis;
  private readonly googleAuth: GoogleAuth;
  private readonly googleDocs: docs_v1.Docs;
  private readonly googleSheets: sheets_v4.Sheets;

  constructor(
    private readonly db: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.googleApis = googleConfiguration.getGoogleApis();
    this.googleAuth = googleConfiguration.getGoogleAuth();
    this.googleDocs = this.googleApis.docs('v1');
    this.googleSheets = this.googleApis.sheets('v4');
  }

  private createTableHeadersEntities(
    tableHeaders: GoogleSheetHeadersInterface,
  ) {
    const headerEntities: GoogleSheetHeaderInterface[] = [];

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.columnCheckStatus,
        GoogleSheetHeaderTypeEnum.checkStatus,
      ),
    );

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.columnDockLink,
        GoogleSheetHeaderTypeEnum.documentLink,
      ),
    );

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.columnBkTitle,
        GoogleSheetHeaderTypeEnum.documentTitle,
      ),
    );

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.clumnFirstAntiPlag,
        GoogleSheetHeaderTypeEnum.textRuResult,
      ),
    );

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.clumnSecondAntiPlag,
        GoogleSheetHeaderTypeEnum.eTextResult,
      ),
    );

    headerEntities.push(
      new SpreadsheetHeader(
        tableHeaders.clumnWordsNumber,
        GoogleSheetHeaderTypeEnum.wordsCount,
      ),
    );

    return headerEntities;
  }

  public async getSpreadsheetMetadata(spreadsheetId: string, range: string) {
    const tableMetadata = await this.googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return tableMetadata?.data;
  }

  public async getDocumentMetadata(documentId: string) {
    const documentMetadata = await this.googleDocs.documents.get({
      documentId: documentId,
    });

    return documentMetadata?.data;
  }

  private async getDocumentEntity(documentId: string): Promise<GoogleDocument> {
    const isCorrect = documentId ? true : false;

    const googleDocument = new GoogleDocumentBuilder(documentId, isCorrect);

    try {
      const documentMetadata = await this.getDocumentMetadata(documentId);

      const documentContent = documentMetadata.body.content;

      documentContent.forEach((structuralElement) => {
        if (structuralElement?.paragraph?.elements) {
          const elements = structuralElement.paragraph.elements;

          elements.forEach((element) => {
            if (element?.textRun) {
              googleDocument.addTextBlock(element.textRun.content);
            }
          });
        }
      });

      return googleDocument;
    } catch (error) {
      console.log('\nGet google document text error: ', error?.response?.data);

      googleDocument.setIsCorrect(false);

      return googleDocument;
    }
  }

  public async getTextFromDocument(documentId: string) {
    const documentEntity = await this.getDocumentEntity(documentId);

    return documentEntity;
  }

  public async getSpreadsheetTable(
    props: SpreadSheetDataDto,
  ): Promise<GoogleSpreadsheetBuilder> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { from, to, spreadsheetId, rangeSheetTitle, ...tableHeaders } =
        props;

      const tableMetadata = await this.getSpreadsheetMetadata(
        spreadsheetId,
        rangeSheetTitle,
      );

      const tableValues = tableMetadata?.values;

      const tableHeadersEntities =
        this.createTableHeadersEntities(tableHeaders);

      const spreadsheet = new GoogleSpreadsheetBuilder(
        tableValues,
      ).setColumnHeaders(tableHeadersEntities);

      return spreadsheet;
    } catch (error) {
      console.log('\nGetSpreadsheetHeadersError: ', error);

      throw new BadRequestException(
        'Произошла ошибка при попытке получить данные о таблице, проверьте введённые данные и права доступа таблицы.',
      );
    }
  }
}
