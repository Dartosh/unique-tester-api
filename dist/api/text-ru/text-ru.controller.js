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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextRuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const text_ru_file_result_dto_1 = require("./dto/text-ru-file-result.dto");
const text_ru_service_1 = require("./text-ru.service");
let TextRuController = class TextRuController {
    constructor(textRuService) {
        this.textRuService = textRuService;
    }
    uploadFiles(props) {
        return this.textRuService.uploadFiles([props]);
    }
    saveFilesResults(props) {
        return this.textRuService.saveFilesResults(props);
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.HttpCode)(204),
    (0, common_1.Post)('upload-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TextRuController.prototype, "uploadFiles", null);
__decorate([
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.HttpCode)(204),
    (0, common_1.Post)('text/save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [text_ru_file_result_dto_1.TextRuFileResultDto]),
    __metadata("design:returntype", Promise)
], TextRuController.prototype, "saveFilesResults", null);
TextRuController = __decorate([
    (0, common_1.Controller)('text-ru'),
    __metadata("design:paramtypes", [text_ru_service_1.TextRuService])
], TextRuController);
exports.TextRuController = TextRuController;
//# sourceMappingURL=text-ru.controller.js.map