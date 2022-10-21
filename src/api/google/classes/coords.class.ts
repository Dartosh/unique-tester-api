import { CoordsInterface } from '../interfaces/coords.interface';

export class Coords implements CoordsInterface {
  public readonly xCoord: number;

  public readonly yCoord: number;

  constructor(xCoord: number, yCoord: number) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
  }
}
