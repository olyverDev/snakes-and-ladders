import { Cell } from './Cell';
import { GameImagesService, ImageName } from '../gameImagesService';

export class User {
  position: Cell;
  x: number;
  y: number;
  name?: string;
  imageName?: ImageName;

  currentFrame = 0;
  framesCount = 24;
  frameSize = 256;
  frameDelay = 50;
  timeSinceLastFrame = 0;

  constructor(position: Cell, name?: string, imageName: ImageName = 'userDance') {
    this.position = position;
    this.x = position.x;
    this.y = position.y;
    this.name = name;
    this.imageName = imageName;
  }

  render = (canvas: CanvasRenderingContext2D, delta: number) => {
    const image = this.imageName ? GameImagesService.collection[this.imageName] : null;

    if (!image) return;

    this.timeSinceLastFrame += delta;
    if (this.timeSinceLastFrame >= this.frameDelay) {
      this.timeSinceLastFrame = 0;
      this.currentFrame++;
    }
    if (this.currentFrame > this.framesCount) {
      this.currentFrame = 0;
    }
    if (this.position) {
      canvas.drawImage(
        image,
        this.currentFrame * this.frameSize,
        0,
        this.frameSize,
        this.frameSize,
        this.x * Cell.cellSize,
        this.y * Cell.cellSize,
        Cell.cellSize,
        Cell.cellSize
      );
    }
  };
}

