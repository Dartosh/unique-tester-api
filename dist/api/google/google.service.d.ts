import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/modules/db';
import { docs_v1, sheets_v4 } from 'googleapis';
import { GoogleDocument } from './interfaces/google-document.interface';
export declare class GoogleService {
    private readonly db;
    private readonly httpService;
    private readonly googleApis;
    private readonly googleAuth;
    private readonly googleDocs;
    private readonly googleSheets;
    constructor(db: PrismaService, httpService: HttpService);
    getSpreadsheetMetadata(spreadsheetId: string, range: string): Promise<sheets_v4.Schema$ValueRange>;
    getDocumentMetadata(documentId: string): Promise<docs_v1.Schema$Document>;
    private getDocumentEntity;
    getTextsFromDocuments(documentsIds: string[]): Promise<PromiseSettledResult<GoogleDocument>[]>;
}
