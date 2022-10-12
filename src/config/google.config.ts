import { GoogleApis } from 'googleapis';
import { googleScopes } from 'src/api/google/constants/google-api-scopes';
import { GoogleAuth } from 'googleapis-common';

export class GoogleConfiguration {
  private readonly googleApis: GoogleApis;
  private googleClient: any;
  private googleAuth: GoogleAuth;

  constructor() {
    this.googleApis = new GoogleApis();
  }

  async configure() {
    this.googleAuth = new this.googleApis.auth.GoogleAuth({
      keyFile: 'google-client.json',
      scopes: googleScopes,
    });

    console.log('Google Auth configured');

    this.googleClient = await this.googleAuth.getClient();
    this.googleApis.options({ auth: this.googleClient });

    console.log('Google Api Options configured');
  }

  public getGoogleApis(): GoogleApis {
    return this.googleApis;
  }

  public getGoogleAuth(): GoogleAuth {
    return this.googleAuth;
  }
}

export const googleConfiguration = new GoogleConfiguration();
