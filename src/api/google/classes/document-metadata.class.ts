import { GoogleDocumentFieldsEnum } from '../enum/google-doc-metadata-fields.enum';
import { CoordsInterface } from '../interfaces/coords.interface';
import { GoogleDocumentMetadataInterface } from '../interfaces/google-doc-metadata.interface';
import { Coords } from './coords.class';

export class DocumentMetadata implements GoogleDocumentMetadataInterface {
  public readonly documentGoogleId: string;

  public readonly checkStatus: string;

  public readonly documentTitle: string;

  public readonly wordsCount: string;

  public readonly documentLink: string;

  public readonly textRuResult: string;

  public readonly eTextResult: string;

  public checkStatusCoords: CoordsInterface;

  public documentTitleCoords: CoordsInterface;

  public documentLinkCoords: CoordsInterface;

  public textRuResultCoords: CoordsInterface;

  public eTextResultCoords: CoordsInterface;

  public wordsCountCoords: CoordsInterface;

  public text?: string;

  public wordsCountValue?: number;

  constructor(
    documentGoogleId: string,
    checkStatus: string,
    documentTitle: string,
    wordsCount: string,
    documentLink: string,
    textRuResult: string,
    eTextResult: string,
  ) {
    this.documentGoogleId = documentGoogleId;
    this.checkStatus = checkStatus;
    this.documentTitle = documentTitle;
    this.wordsCount = wordsCount;
    this.documentLink = documentLink;
    this.textRuResult = textRuResult;
    this.eTextResult = eTextResult;
  }

  public setCellCoords(
    xCoord: number,
    yCoord: number,
    cellName: GoogleDocumentFieldsEnum,
  ) {
    this[cellName] = new Coords(xCoord, yCoord);

    return this;
  }

  public setText(text: string) {
    this.text = text.replace(/\n/g, ' ');

    return this;
  }

  public setWordsCount(wordsCountValue: number) {
    this.wordsCountValue = wordsCountValue;

    return this;
  }

  public getWordCount() {
    this.wordsCountValue = this.text.split(' ').filter((n) => {
      return n != '';
    }).length;

    return this;
  }
}
