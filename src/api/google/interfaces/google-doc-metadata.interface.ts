import { GoogleDocumentFieldsEnum } from '../enum/google-doc-metadata-fields.enum';
import { CoordsInterface } from './coords.interface';

export interface GoogleDocumentMetadataInterface {
  readonly documentGoogleId: string;

  readonly checkStatus: string;

  readonly documentTitle: string;

  readonly wordsCount: string;

  readonly documentLink: string;

  readonly textRuResult: string;

  readonly eTextResult: string;

  checkStatusCoords?: CoordsInterface;

  documentTitleCoords?: CoordsInterface;

  documentLinkCoords?: CoordsInterface;

  textRuResultCoords?: CoordsInterface;

  eTextResultCoords?: CoordsInterface;

  wordsCountCoords?: CoordsInterface;

  text?: string;

  wordsCountValue?: number;

  setCellCoords(
    xCoord: number,
    yCoord: number,
    cellName: GoogleDocumentFieldsEnum,
  ): GoogleDocumentMetadataInterface;

  setText(text: string): GoogleDocumentMetadataInterface;

  setWordsCount(wordsCountValue: number): GoogleDocumentMetadataInterface;

  getWordCount(): GoogleDocumentMetadataInterface;
}
