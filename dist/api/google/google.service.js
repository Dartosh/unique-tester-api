"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const db_1 = require("../../modules/db");
const google_config_1 = require("../../config/google.config");
const document_builder_class_1 = require("./classes/document-builder.class");
let GoogleService = class GoogleService {
    constructor(db, httpService) {
        this.db = db;
        this.httpService = httpService;
        this.googleApis = google_config_1.googleConfiguration.getGoogleApis();
        this.googleAuth = google_config_1.googleConfiguration.getGoogleAuth();
        this.googleDocs = this.googleApis.docs('v1');
        this.googleSheets = this.googleApis.sheets('v4');
    }
    async getSpreadsheetMetadata(spreadsheetId, range) {
        const tableMetadata = await this.googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return tableMetadata === null || tableMetadata === void 0 ? void 0 : tableMetadata.data;
    }
    async getDocumentMetadata(documentId) {
        const documentMetadata = await this.googleDocs.documents.get({
            documentId: documentId,
        });
        return documentMetadata === null || documentMetadata === void 0 ? void 0 : documentMetadata.data;
    }
    async getDocumentEntity(documentId) {
        var _a;
        const googleDocument = new document_builder_class_1.GoogleDocumentBuilder(documentId, true);
        try {
            const documentMetadata = await this.getDocumentMetadata(documentId);
            const documentContent = documentMetadata.body.content;
            documentContent.forEach((structuralElement) => {
                var _a;
                if ((_a = structuralElement === null || structuralElement === void 0 ? void 0 : structuralElement.paragraph) === null || _a === void 0 ? void 0 : _a.elements) {
                    const elements = structuralElement.paragraph.elements;
                    elements.forEach((element) => {
                        if (element === null || element === void 0 ? void 0 : element.textRun) {
                            googleDocument.addTextBlock(element.textRun.content);
                        }
                    });
                }
            });
            return googleDocument;
        }
        catch (error) {
            console.log('\nGet google document text error: ', (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            googleDocument.setIsCorrect(false);
            return googleDocument;
        }
    }
    async getTextsFromDocuments(documentsIds) {
        const documentPromises = documentsIds.map(async (documentId) => {
            const documentEntity = await this.getDocumentEntity(documentId);
            return documentEntity;
        });
        const googleDocumentsEntities = await Promise.allSettled(documentPromises);
        return googleDocumentsEntities;
    }
};
GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_1.PrismaService,
        axios_1.HttpService])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=google.service.js.map