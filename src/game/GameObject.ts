import { Cell } from './Cell';
import { orientations } from './constants';

export abstract class GameObject {
  private X = 0;
  private Y = 0;
  private SIZE_X = 0;
  private SIZE_Y = 0;
  private IMAGE: HTMLImageElement;
  private ORIENTATION: orientations;

  constructor(
    image: HTMLImageElement,
    x?: number,
    y?: number,
    sizeX?: number,
    sizeY?: number,
    orientation = orientations.left
  ) {
    this.X = x || 0;
    this.Y = y || 0;
    this.SIZE_X = sizeX || 0;
    this.SIZE_Y = sizeY || 0;
    this.IMAGE = image;
    this.ORIENTATION = orientation;
  }

  abstract render: (canvas: CanvasRenderingContext2D) => void;

  get x() {
    return this.X;
  }
  get y() {
    return this.Y;
  }
  get sizeX() {
    return this.SIZE_X;
  }
  get sizeY() {
    return this.SIZE_Y;
  }
  get image() {
    return this.IMAGE;
  }
  set sizeX(sizeX: number) {
    this.SIZE_X = sizeX;
  }
  set sizeY(sizeY: number) {
    this.SIZE_Y = sizeY;
  }
  set x(x: number) {
    this.X = x;
  }
  set y(y: number) {
    this.Y = y;
  }
  set image(image: HTMLImageElement) {
    this.IMAGE = image;
  }
  get isLeft() {
    return this.ORIENTATION === orientations.left;
  }
  get isRight() {
    return this.ORIENTATION === orientations.left;
  }
  get orientation() {
    return this.ORIENTATION;
  }
}
