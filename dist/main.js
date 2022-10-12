"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./api/app.module");
const google_config_1 = require("./config/google.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
        cors: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const configService = app.get(config_1.ConfigService);
    const appConfig = configService.get('app');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Unique-tester')
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(appConfig.port, () => {
        console.log(`Server launched on host: ${appConfig.host}:${appConfig.port}`);
    });
    await google_config_1.googleConfiguration.configure();
}
bootstrap();
//# sourceMappingURL=main.js.map