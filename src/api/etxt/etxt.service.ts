import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as uid from 'uid';
import { createCipheriv, createDecipheriv } from 'crypto';
import { URLSearchParams } from 'url';
import { lastValueFrom } from 'rxjs';
import * as xmlbuilder from 'xmlbuilder';
import * as runner from 'child_process';

import { PrismaService } from 'src/modules/db';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { GoogleService } from '../google/google.service';
import { TextRuService } from '../text-ru/text-ru.service';
import { GoogleDocumentMetadataInterface } from '../google/interfaces/google-doc-metadata.interface';
import { FILE_DESTINATION } from 'src/constants/e-txt.constants';

@Injectable()
export class EtxtService {
  constructor(
    private readonly db: PrismaService,
    private readonly httpService: HttpService,
    private readonly googleService: GoogleService,
    private readonly textRuService: TextRuService,
    private readonly configService: ConfigService,
  ) {}

  private readonly XML_OPTIONS = {
    version: '1.0',
    encoding: 'UTF-8',
  };

  private readonly E_TXT_URL = `http://${this.configService.get(
    'E_TXT_HOST',
  )}:${this.configService.get('E_TXT_PORT')}/etxt_antiplagiat`;

  private readonly SERVER_TYPE = 'server';

  private readonly SAVE_RESULTS_URL =
    'http://63.250.59.172/api/e-txt/text/save';

  private readonly getFileUrl = (fileName: string) =>
    `http://63.250.59.172/api/e-txt/text/${fileName}`;

  private readonly getFullRequestUrl = (fileName: string) =>
    `${this.E_TXT_URL}?xmlUrl=${encodeURIComponent(
      this.getFileUrl(fileName),
    )}&xmlAnswerUrl=${encodeURIComponent(this.SAVE_RESULTS_URL)}`;

  private decodeTextFromBase64 = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary');

  private encodeTextToBase64 = (str: string): string =>
    Buffer.from(str, 'binary').toString('base64');

  public async uploadFilesETxt(props: SpreadSheetDataDto) {
    const spreadsheet = await this.googleService.getSpreadsheetTable(props);

    const savedTable = await this.textRuService.saveOrUpdateTable(
      props,
      spreadsheet,
    );

    const documents = spreadsheet.getGoogleDocuments(props?.from, props?.to);

    const root = xmlbuilder.create('root', this.XML_OPTIONS);

    root.ele('serverType', this.SERVER_TYPE);

    const documentsPromises = documents.map(async (document) => {
      const documentEntity = await this.googleService.getTextFromDocument(
        document.documentGoogleId,
      );

      document.setText(documentEntity.text);

      document.getWordCount();

      const savedDocument = await this.textRuService.saveOrUpdateDocument(
        document,
        savedTable,
      );

      console.log(savedDocument);

      if (!props.isOnlyWords) {
        await this.configureAndSaveETxtResult(
          savedDocument.documentGoogleId,
          root,
          document,
        );
      }
    });

    await Promise.allSettled(documentsPromises);

    const resultXml = root.end({ pretty: true });

    const encryptedXml = this.encryptXmlFile(resultXml);

    const fileName = uid.uid(16);

    fs.writeFileSync(
      path.join(__dirname, '../..', FILE_DESTINATION, `${fileName}`),
      encryptedXml,
    );

    const params = new URLSearchParams({
      xmlUrl: this.getFileUrl(fileName),
      xmlAnswerUrl: this.SAVE_RESULTS_URL,
    });

    const eTxtRequest = this.httpService.post(
      this.E_TXT_URL,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    try {
      const response = await lastValueFrom(eTxtRequest);

      console.log('response:\n', response?.data);
    } catch (error) {
      console.log('error:\n', error);
    }

    return fileName;
  }

  private async configureAndSaveETxtResult(
    documentId: string,
    documentsXmlBody: xmlbuilder.XMLElement,
    document: GoogleDocumentMetadataInterface,
  ) {
    try {
      const savedETxtResult = await this.db.eTxtResult.upsert({
        where: {
          documentId,
        },
        update: {
          documentId,
        },
        create: {
          documentId,
        },
        select: {
          id: true,
        },
      });

      const entry = documentsXmlBody.ele('entry');

      entry.ele('id', savedETxtResult.id);

      entry.ele('name', document.documentTitle);

      entry.ele('text', this.encodeTextToBase64(document.text));
    } catch (error) {
      console.log(error);
    }
  }

  private encryptXmlFile(xml: string): Buffer {
    let text = Buffer.from(xml, 'utf8').toString();

    console.log('text:\n', text);

    const cipher = createCipheriv(
      'aes-128-ecb',
      this.configService.get('E_TXT_SECRET_KEY'),
      Buffer.alloc(0),
    );

    // длина строки должна быть кратна 16, дополняем строку символами "\0" до достижения нужной длины (вручную это делаем)
    const strLength = Buffer.byteLength(text, 'utf8');

    const padLength = strLength % 16 == 0 ? 0 : 16 - (strLength % 16);

    text = text + ''.padEnd(padLength, '\0');

    cipher.setAutoPadding(false);

    return Buffer.concat([cipher.update(text), cipher.final()]);
  }

  public decryptXmlFile(xml: any) {
    const decipher = createDecipheriv(
      'aes-128-ecb',
      this.configService.get('E_TXT_SECRET_KEY'),
      Buffer.from([]),
    );

    const decrypted = Buffer.concat([
      decipher.update(xml),
      decipher.final(),
    ]).toString('utf8');

    console.log(decrypted);

    // return decrypted;
  }

  private customPadding(str: string, blockSize: number, padder: any) {
    let resultStr = new Buffer(str);

    //1 char = 8bytes
    const bitLength = str.length * 8;

    if (bitLength < blockSize) {
      for (let i = bitLength; i < blockSize; i += 8) {
        resultStr += padder;
      }
    } else if (bitLength > blockSize) {
      while ((str.length * 8) % blockSize != 0) {
        resultStr += padder;
      }
    }

    return new Buffer(resultStr);
  }
}
