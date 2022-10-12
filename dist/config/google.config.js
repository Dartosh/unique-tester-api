"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleConfiguration = exports.GoogleConfiguration = void 0;
const googleapis_1 = require("googleapis");
const google_api_scopes_1 = require("../api/google/constants/google-api-scopes");
class GoogleConfiguration {
    constructor() {
        this.googleApis = new googleapis_1.GoogleApis();
    }
    async configure() {
        this.googleAuth = new this.googleApis.auth.GoogleAuth({
            keyFile: 'google-client.json',
            scopes: google_api_scopes_1.googleScopes,
        });
        console.log('Google Auth configured');
        this.googleClient = await this.googleAuth.getClient();
        this.googleApis.options({ auth: this.googleClient });
        console.log('Google Api Options configured');
    }
    getGoogleApis() {
        return this.googleApis;
    }
    getGoogleAuth() {
        return this.googleAuth;
    }
}
exports.GoogleConfiguration = GoogleConfiguration;
exports.googleConfiguration = new GoogleConfiguration();
//# sourceMappingURL=google.config.js.map