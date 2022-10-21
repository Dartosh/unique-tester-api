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
import { UpdateTableDto } from './dto/update-table.dto';

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

  public async updateSpreadsheetTable(props: UpdateTableDto): Promise<void> {
    const spreadsheetTable = await this.db.table.findUnique({
      where: {
        tableGoogleId_tableRange: {
          tableGoogleId: props.spreadsheetId,
          tableRange: props.rangeSheetTitle,
        },
      },
      select: {
        documents: {
          select: {
            textRuResultResponse: true,
            checkStatus: true,
            checkStatusCoords: {
              select: {
                xCoord: true,
                yCoord: true,
              },
            },
            textRuResult: true,
            textRuResultCoords: {
              select: {
                xCoord: true,
                yCoord: true,
              },
            },
            eTextResult: true,
            eTextResultCoords: {
              select: {
                xCoord: true,
                yCoord: true,
              },
            },
            wordsCountValue: true,
            wordsCountCoords: {
              select: {
                xCoord: true,
                yCoord: true,
              },
            },
          },
        },
      },
    });

    try {
      const spreadsheetTableMetadata = await this.getSpreadsheetMetadata(
        props.spreadsheetId,
        props.rangeSheetTitle,
      );

      const updatedSpreadsheetTableValues = spreadsheetTableMetadata.values;

      spreadsheetTable.documents.forEach((document) => {
        updatedSpreadsheetTableValues[document.checkStatusCoords.yCoord][
          document.checkStatusCoords.xCoord
        ] = document?.checkStatus || '';

        updatedSpreadsheetTableValues[document.eTextResultCoords.yCoord][
          document.eTextResultCoords.xCoord
        ] = document?.eTextResult || '';

        updatedSpreadsheetTableValues[document.textRuResultCoords.yCoord][
          document.textRuResultCoords.xCoord
        ] = document?.textRuResultResponse?.textUnique || '';

        updatedSpreadsheetTableValues[document.wordsCountCoords.yCoord][
          document.wordsCountCoords.xCoord
        ] = document?.wordsCountValue || '';
      });

      const updateTableResult =
        await this.googleSheets.spreadsheets.values.batchUpdate({
          spreadsheetId: props.spreadsheetId,
          requestBody: {
            data: [
              {
                range: props.rangeSheetTitle,
                values: updatedSpreadsheetTableValues,
              },
            ],
            valueInputOption: 'USER_ENTERED',
          },
        });

      console.log(
        '\n%d cells updated.',
        updateTableResult.data.totalUpdatedCells,
      );
    } catch (error) {
      console.log('GoogleUpdateSpreadsheetTableError:\n', error);

      throw new BadRequestException(
        'Произошла ошибка при обновлении Google-таблицы, проверьте доступ к таблице.',
      );
    }
  }
}
