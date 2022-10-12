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
exports.TextRuService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const db_1 = require("../../modules/db");
let TextRuService = class TextRuService {
    constructor(db, httpService) {
        this.db = db;
        this.httpService = httpService;
        this.UPLOAD_FILE_URL = 'http://api.text.ru/post';
    }
    makeFileFormData(file) {
        const fileKeys = Object.keys(file);
        const bodyFormData = new FormData();
        fileKeys.forEach((fileKey) => {
            bodyFormData.append(fileKey, file[fileKey]);
        });
        return bodyFormData;
    }
    async uploadFiles(files) {
        const filePromises = files.map((file) => {
            const bodyFormData = this.makeFileFormData(file);
            return this.httpService.post(this.UPLOAD_FILE_URL, bodyFormData);
        });
        try {
            await Promise.allSettled(filePromises.map(async (filePromise) => {
                const filePromiseResult = await (0, rxjs_1.lastValueFrom)(filePromise);
                const fileInfo = filePromiseResult.data;
                await this.db.textRuTexts.create({
                    data: {
                        uid: fileInfo.text_uid,
                    },
                });
            }));
        }
        catch (error) {
            console.log('TextRuIploadFilesError: ', error);
            throw new common_1.BadRequestException('Произошла ошибка при загрузке файлов на Text.ru.');
        }
    }
    async saveFilesResults(props) {
        try {
            await this.db.textRuTexts.update({
                where: {
                    uid: props.uid,
                },
                data: {
                    textUnique: props.text_unique,
                },
            });
        }
        catch (error) {
            console.log('TextRuSaveResultsError: ', error);
            throw new common_1.BadRequestException('Произошла ошибка при получении результата проверки текста');
        }
    }
};
TextRuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_1.PrismaService,
        axios_1.HttpService])
], TextRuService);
exports.TextRuService = TextRuService;
//# sourceMappingURL=text-ru.service.js.map