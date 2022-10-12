import { GoogleApis } from 'googleapis';
import { GoogleAuth } from 'googleapis-common';
export declare class GoogleConfiguration {
    private readonly googleApis;
    private googleClient;
    private googleAuth;
    constructor();
    configure(): Promise<void>;
    getGoogleApis(): GoogleApis;
    getGoogleAuth(): GoogleAuth;
}
export declare const googleConfiguration: GoogleConfiguration;
