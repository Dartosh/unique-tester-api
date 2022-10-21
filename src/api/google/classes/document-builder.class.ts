import { GoogleDocument } from '../interfaces/google-document.interface';

export class GoogleDocumentBuilder implements GoogleDocument {
  public documentId?: string;

  public isCorrect: boolean;

  public text: string;

  constructor(documentId: string, isCorrect: boolean /*, title: string*/) {
    this.documentId = documentId;
    // this.title = title;
    this.text = '';
    this.isCorrect = isCorrect;
  }

  public addTextBlock(text: string): void {
    this.text += text.replace(/\n/g, ' ');
  }

  public setIsCorrect(isCorrect: boolean) {
    this.isCorrect = isCorrect;
  }
}
