"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextRuModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const module_1 = require("../../modules/db/module");
const text_ru_service_1 = require("./text-ru.service");
const text_ru_controller_1 = require("./text-ru.controller");
let TextRuModule = class TextRuModule {
};
TextRuModule = __decorate([
    (0, common_1.Module)({
        imports: [module_1.PrismaModule, axios_1.HttpModule],
        providers: [text_ru_service_1.TextRuService],
        controllers: [text_ru_controller_1.TextRuController],
    })
], TextRuModule);
exports.TextRuModule = TextRuModule;
//# sourceMappingURL=text-ru.module.js.map