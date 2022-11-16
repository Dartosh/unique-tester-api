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
import * as xml2js from 'xml2js';

import { PrismaService } from 'src/modules/db';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { GoogleService } from '../google/google.service';
import { TextRuService } from '../text-ru/text-ru.service';
import { GoogleDocumentMetadataInterface } from '../google/interfaces/google-doc-metadata.interface';
import { FILE_DESTINATION } from 'src/constants/e-txt.constants';
import { TextRuFileResultDto } from './dto/e-txt-result.dto';
import {
  EntryType,
  ETxtResultsObjectType,
} from './interfaces/etxt-results-object.interface';

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

    // console.log(
    //   'encrypted: ',
    //   encryptedXml
    //     .toJSON()
    //     .data.map((byte) => (byte >>> 0).toString(2))
    //     .join(' '),
    // );

    //try to string and binary writting

    fs.writeFileSync(
      path.join(__dirname, '../..', FILE_DESTINATION, `${fileName}`),
      encryptedXml.toString('binary'),
      'binary',
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
      await lastValueFrom(eTxtRequest);
      // console.log('response:\n', response?.data);
    } catch (error) {
      console.log('error:\n', error);
    }

    return fileName;
  }

  public async saveETxtResults(props: TextRuFileResultDto): Promise<void> {
    const decrypted = this.decryptXmlFile(props.Xml);

    const documentsResults: EntryType[] = [];

    new xml2js.parseString(
      decrypted,
      (error: Error, result: ETxtResultsObjectType) => {
        if (error) {
          throw error;
        }

        console.log(result.root.entry);

        result?.root?.entry?.forEach((entry) => {
          documentsResults.push(entry);
        });
      },
    );

    const documentsPromises = documentsResults.map(async (documentResult) => {
      await this.db.eTxtResult.update({
        where: {
          uid: documentResult.id,
        },
        data: {
          jsonResponse: JSON.stringify(documentResult),
          textUnique: +documentResult.ftext[0].$.uniq,
        },
      });
    });

    Promise.allSettled(documentsPromises);
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
          uid: uid.uid(16),
        },
        select: {
          uid: true,
        },
      });

      const entry = documentsXmlBody.ele('entry');

      entry.ele('id', savedETxtResult.uid);

      entry.ele('name', this.encodeTextToBase64(document.documentTitle));

      entry.ele('text', this.encodeTextToBase64(document.text));
    } catch (error) {
      console.log(error);
    }
  }

  private encryptXmlFile(xml: string): Buffer {
    let text = Buffer.from(xml, 'utf8').toString();

    const cipher = createCipheriv(
      'aes-128-ecb',
      String(this.configService.get('E_TXT_SECRET_KEY')),
      Buffer.alloc(0),
    );

    // длина строки должна быть кратна 16, дополняем строку символами "\0" до достижения нужной длины (вручную это делаем)
    const strLength = Buffer.byteLength(text, 'utf8');

    const padLength = strLength % 16 == 0 ? 0 : 16 - (strLength % 16);

    text = text + ''.padEnd(padLength, '\0');

    cipher.setAutoPadding(false);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted;
  }

  public decryptXmlFile(text: string) {
    const formattedText = text.replace(/ /g, '+');

    const bufferString = Buffer.from(formattedText, 'base64');

    // console.log('formattedText:\n', formattedText);

    // const bufferText = Buffer.from(
    //   Buffer.from(formattedText, 'base64').toString('base64'),
    //   'binary',
    // );

    const decipher = createDecipheriv(
      'aes-128-ecb',
      String(this.configService.get('E_TXT_SECRET_KEY')),
      Buffer.alloc(0),
    ).setAutoPadding(false);

    return Buffer.concat([
      decipher.update(bufferString),
      decipher.final(),
    ]).toString('utf8');
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
