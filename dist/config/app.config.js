"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.APP_PORT),
    host: process.env.APP_HOST,
}));
//# sourceMappingURL=app.config.js.map