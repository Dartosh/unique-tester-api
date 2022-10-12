import { GoogleDocument } from '../interfaces/google-document.interface';
export declare class GoogleDocumentBuilder implements GoogleDocument {
    readonly documentId: string;
    readonly title: string;
    isCorrect: boolean;
    text: string;
    wordsCount: number;
    constructor(documentId: string, isCorrect: boolean);
    addTextBlock(text: string): void;
    setIsCorrect(isCorrect: boolean): void;
}
