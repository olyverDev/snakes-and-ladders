import { Cell } from './Cell';
import { GameImagesService } from '../gameImagesService';

export class User {
  position: Cell;
  x: number;
  y: number;

  currentFrame = 0;
  framesCount = 24;
  frameSize = 256;
  frameDelay = 50;
  timeSinceLastFrame = 0;

  constructor(position: Cell) {
    this.position = position;
    this.x = position.x;
    this.y = position.y;
  }

  render = (canvas: CanvasRenderingContext2D, delta: number) => {
    if (!GameImagesService.collection.userDance) return;
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
        GameImagesService.collection.userDance,
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

