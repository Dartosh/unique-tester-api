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
exports.GoogleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const google_service_1 = require("./google.service");
class a {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], a.prototype, "spreadsheetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], a.prototype, "range", void 0);
let GoogleController = class GoogleController {
    constructor(googleService) {
        this.googleService = googleService;
    }
    uploadFiles(props) {
        const metadata = this.googleService.getSpreadsheetMetadata(props.spreadsheetId, props.range);
        return metadata;
    }
};
__decorate([
    (0, common_1.Post)('upload-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [a]),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "uploadFiles", null);
GoogleController = __decorate([
    (0, common_1.Controller)('google'),
    __metadata("design:paramtypes", [google_service_1.GoogleService])
], GoogleController);
exports.GoogleController = GoogleController;
//# sourceMappingURL=google.controller.js.map