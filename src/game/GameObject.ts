import { Cell } from './Cell';
import { orientations } from './constants';
type GameObjectProps = {
  image: HTMLImageElement;
  x?: number;
  y?: number;
  sizeX?: number;
  sizeY?: number;
  orientation?: orientations;
  fromId?: number;
  toId?: number;
};
export abstract class GameObject {
  private X = 0;
  private Y = 0;
  private SIZE_X = 0;
  private SIZE_Y = 0;
  private IMAGE: HTMLImageElement;
  private ORIENTATION: orientations;
  private FROM_ID: number;
  private TO_ID: number;

  constructor({
    image,
    x,
    y,
    sizeX,
    sizeY,
    orientation = orientations.left,
    fromId = 0,
    toId = 0,
  }: GameObjectProps) {
    this.X = x || 0;
    this.Y = y || 0;
    this.SIZE_X = sizeX || 0;
    this.SIZE_Y = sizeY || 0;
    this.IMAGE = image;
    this.ORIENTATION = orientation;
    this.FROM_ID = fromId;
    this.TO_ID = toId;
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
  get fromId() {
    return this.FROM_ID;
  }
  get toId() {
    return this.TO_ID;
  }
}
