import { GoogleService } from './google.service';
declare class a {
    spreadsheetId: string;
    range: string;
}
export declare class GoogleController {
    private readonly googleService;
    constructor(googleService: GoogleService);
    uploadFiles(props: a): Promise<any>;
}
export {};
