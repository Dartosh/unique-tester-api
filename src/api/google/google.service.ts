import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/db';
import { GoogleAuth } from 'googleapis-common';
import { docs_v1, google, GoogleApis, sheets_v4 } from 'googleapis';

import { googleConfiguration } from 'src/config/google.config';
import { GoogleDocumentBuilder } from './classes/document-builder.class';
import { GoogleDocument } from './interfaces/google-document.interface';

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
    const googleDocument = new GoogleDocumentBuilder(documentId, true);

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

  public async getTextsFromDocuments(documentsIds: string[]) {
    const documentPromises = documentsIds.map(async (documentId) => {
      const documentEntity = await this.getDocumentEntity(documentId);

      return documentEntity;
    });

    const googleDocumentsEntities = await Promise.allSettled(documentPromises);

    return googleDocumentsEntities;
  }
}
