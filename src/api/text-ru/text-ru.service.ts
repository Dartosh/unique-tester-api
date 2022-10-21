import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Table } from '@prisma/client';

import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';

import { PrismaService } from 'src/modules/db';
import { GoogleSpreadsheetBuilder } from '../google/classes/spreadsheet-builder.class';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { GoogleSheetHeaderTypeEnum } from '../google/enum/google-sheet-header-type.enum';
import { GoogleService } from '../google/google.service';
import { GoogleDocumentMetadataInterface } from '../google/interfaces/google-doc-metadata.interface';
import { TextRuFile } from './classes/text-ru-file.class';
import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';
import { TextRuFileUidResponseInterface } from './interfaces/responses/text-ru-file-uid-res.interface';
import { TextRuFileInterface } from './interfaces/text-ru-file.interface';

@Injectable()
export class TextRuService {
  constructor(
    private readonly db: PrismaService,
    private readonly httpService: HttpService,
    private readonly googleService: GoogleService,
  ) {}

  private readonly UPLOAD_FILE_URL = 'http://api.text.ru/post';

  private readonly SECRET_USER_KEY = '7075d2598be0e5ffa5d04829e731fb88';

  private readonly CALLBACK_URL = 'http://63.250.59.172/api/text-ru/text/save';

  private async saveOrUpdateTable(
    tableData: SpreadSheetDataDto,
    spreasheet: GoogleSpreadsheetBuilder,
  ): Promise<Table> {
    const savedTable = await this.db.table.upsert({
      where: {
        tableGoogleId_tableRange: {
          tableGoogleId: tableData.spreadsheetId,
          tableRange: tableData.rangeSheetTitle,
        },
      },
      update: {
        checkStatus: tableData.columnCheckStatus,
        documentLink: tableData.columnDockLink,
        documentTitle: tableData.columnBkTitle,
        textRuResult: tableData.clumnFirstAntiPlag,
        eTextResult: tableData.clumnSecondAntiPlag,
        wordsCount: tableData.clumnWordsNumber,
        checkStatusCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.checkStatus,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.checkStatus,
            ).yCoord,
          },
        },
        documentLinkCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentLink,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentLink,
            ).yCoord,
          },
        },
        documentTitleCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentTitle,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentTitle,
            ).yCoord,
          },
        },
        textRuResultCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.textRuResult,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.textRuResult,
            ).yCoord,
          },
        },
        eTextResultCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.eTextResult,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.eTextResult,
            ).yCoord,
          },
        },
        wordsCountCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.wordsCount,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.wordsCount,
            ).yCoord,
          },
        },
      },
      create: {
        tableGoogleId: tableData.spreadsheetId,
        tableRange: tableData.rangeSheetTitle,
        checkStatus: tableData.columnCheckStatus,
        documentLink: tableData.columnDockLink,
        documentTitle: tableData.columnBkTitle,
        textRuResult: tableData.clumnFirstAntiPlag,
        eTextResult: tableData.clumnSecondAntiPlag,
        wordsCount: tableData.clumnWordsNumber,
        checkStatusCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.checkStatus,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.checkStatus,
            ).yCoord,
          },
        },
        documentLinkCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentLink,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentLink,
            ).yCoord,
          },
        },
        documentTitleCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentTitle,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.documentTitle,
            ).yCoord,
          },
        },
        textRuResultCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.textRuResult,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.textRuResult,
            ).yCoord,
          },
        },
        eTextResultCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.eTextResult,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.eTextResult,
            ).yCoord,
          },
        },
        wordsCountCoords: {
          create: {
            xCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.wordsCount,
            ).xCoord,
            yCoord: spreasheet.getHeaderByType(
              GoogleSheetHeaderTypeEnum.wordsCount,
            ).yCoord,
          },
        },
      },
    });

    return savedTable;
  }

  private async saveOrUpdateDocument(
    document: GoogleDocumentMetadataInterface,
    savedTable: Table,
  ) {
    const savedDocument = await this.db.document.upsert({
      where: {
        documentGoogleId: document.documentGoogleId,
      },
      update: {
        documentGoogleId: document.documentGoogleId,
        wordsCountValue: document.wordsCountValue,
        checkStatus: document.checkStatus,
        checkStatusCoords: {
          create: {
            xCoord: document.checkStatusCoords.xCoord,
            yCoord: document.checkStatusCoords.yCoord,
          },
        },
        documentTitle: document.documentTitle,
        documentTitleCoords: {
          create: {
            xCoord: document.documentTitleCoords.xCoord,
            yCoord: document.documentTitleCoords.yCoord,
          },
        },
        documentLink: document.documentLink,
        documentLinkCoords: {
          create: {
            xCoord: document.documentLinkCoords.xCoord,
            yCoord: document.documentLinkCoords.yCoord,
          },
        },
        textRuResult: document.textRuResult,
        textRuResultCoords: {
          create: {
            xCoord: document.textRuResultCoords.xCoord,
            yCoord: document.textRuResultCoords.yCoord,
          },
        },
        eTextResult: document.eTextResult,
        eTextResultCoords: {
          create: {
            xCoord: document.eTextResultCoords.xCoord,
            yCoord: document.eTextResultCoords.yCoord,
          },
        },
        wordsCount: document.wordsCount,
        wordsCountCoords: {
          create: {
            xCoord: document.wordsCountCoords.xCoord,
            yCoord: document.wordsCountCoords.yCoord,
          },
        },
      },
      create: {
        table: { connect: { id: savedTable.id } },
        documentGoogleId: document.documentGoogleId,
        checkStatus: document.checkStatus,
        checkStatusCoords: {
          create: {
            xCoord: document.checkStatusCoords.xCoord,
            yCoord: document.checkStatusCoords.yCoord,
          },
        },
        documentTitle: document.documentTitle,
        documentTitleCoords: {
          create: {
            xCoord: document.documentTitleCoords.xCoord,
            yCoord: document.documentTitleCoords.yCoord,
          },
        },
        documentLink: document.documentLink,
        documentLinkCoords: {
          create: {
            xCoord: document.documentLinkCoords.xCoord,
            yCoord: document.documentLinkCoords.yCoord,
          },
        },
        textRuResult: document.textRuResult,
        textRuResultCoords: {
          create: {
            xCoord: document.textRuResultCoords.xCoord,
            yCoord: document.textRuResultCoords.yCoord,
          },
        },
        eTextResult: document.eTextResult,
        eTextResultCoords: {
          create: {
            xCoord: document.eTextResultCoords.xCoord,
            yCoord: document.eTextResultCoords.yCoord,
          },
        },
        wordsCount: document.wordsCount,
        wordsCountCoords: {
          create: {
            xCoord: document.wordsCountCoords.xCoord,
            yCoord: document.wordsCountCoords.yCoord,
          },
        },
      },
      select: {
        documentGoogleId: true,
      },
    });

    return savedDocument;
  }

  public async uploadFilesTextRu(props: SpreadSheetDataDto) {
    const spreadsheet = await this.googleService.getSpreadsheetTable(props);

    const savedTable = await this.saveOrUpdateTable(props, spreadsheet);

    const documents = spreadsheet.getGoogleDocuments(props?.from, props?.to);

    const documentsPromises = documents.map(async (document) => {
      const documentEntity = await this.googleService.getTextFromDocument(
        document.documentGoogleId,
      );

      document.setText(documentEntity.text).getWordCount();

      const savedDocument = await this.saveOrUpdateDocument(
        document,
        savedTable,
      );

      if (!props.isOnlyWords) {
        const textRuFile = new TextRuFile(
          document.text,
          this.SECRET_USER_KEY,
          this.CALLBACK_URL,
        );

        await this.uploadFile(textRuFile, savedDocument.documentGoogleId);
      }
    });

    await Promise.allSettled(documentsPromises);

    return {
      massage: 'OK',
    };
  }

  private makeFileFormData(file: TextRuFileInterface): FormData {
    const fileKeys = Object.keys(file);

    const bodyFormData = new FormData();

    fileKeys.forEach((fileKey) => {
      bodyFormData.append(fileKey, String(file[fileKey]));
    });

    return bodyFormData;
  }

  public async uploadFile(
    file: TextRuFileInterface,
    documentId: string,
  ): Promise<void> {
    const bodyFormData = this.makeFileFormData(file);

    const request = this.httpService.post(this.UPLOAD_FILE_URL, bodyFormData);

    try {
      const filePromiseResult = await lastValueFrom(request);

      const fileInfo: TextRuFileUidResponseInterface = filePromiseResult.data;

      await this.db.textRuResult.upsert({
        where: {
          documentId,
        },
        update: {
          uid: fileInfo.text_uid,
        },
        create: {
          uid: fileInfo.text_uid,
          documentId,
        },
      });
    } catch (error) {
      console.log('TextRuIploadFilesError: ', error);

      throw new BadRequestException(
        'Произошла ошибка при загрузке файлов на Text.ru.',
      );
    }
  }

  public async saveFilesResults(props: any): Promise<void> {
    try {
      console.log('Got request: ', props);

      await this.db.textRuResult.update({
        where: {
          uid: props.uid,
        },
        data: {
          textUnique: props.text_unique,
          // spellCheck: JSON.stringify(props.spell_check.replace('\\', '')),
          // jsonResult: JSON.stringify(props.json_result.replace('\\', '')),
        },
      });
    } catch (error) {
      console.log('TextRuSaveResultsError: ', error);

      throw new BadRequestException(
        'Произошла ошибка при получении результата проверки текста',
      );
    }
  }
}
