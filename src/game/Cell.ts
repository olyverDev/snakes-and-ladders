import { GameImagesService } from '../gameImagesService';
import { GameObject } from './GameObject';

const { collection: images } = GameImagesService;

export class Cell extends GameObject {
  constructor(x: number, y: number) {
    let image = null;
    if (x % 2 !== 0) {
      image = y % 2 === 0 ? images.redCell : images.blueCell;
    } else {
      image = y % 2 !== 0 ? images.redCell : images.blueCell;
    }
    super(image, x, y);
    this.id = Cell.currentId++;
  }

  static cellSize = 0;
  static currentId = 0;

  id = 0;
  color = images.redCell;

  render = (canvas: CanvasRenderingContext2D) => {
    if (!this.image) return;

    canvas.drawImage(
      this.image,
      this.x * Cell.cellSize,
      this.y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );

    // TODO: remove me ---------------
    canvas.font = '35px serif';
    canvas.fillStyle = 'white';
    const offset = 20;
    canvas.fillText(
      '' + this.id,
      this.x * Cell.cellSize + Cell.cellSize / 2 - offset,
      this.y * Cell.cellSize + Cell.cellSize / 2
    );
    canvas.fillText(
      'x:' + this.x,
      this.x * Cell.cellSize + Cell.cellSize / 2 - 30 - offset,
      this.y * Cell.cellSize + Cell.cellSize / 2 + 40
    );
    canvas.fillText(
      'y:' + this.y,
      this.x * Cell.cellSize + Cell.cellSize / 2 + 30 - offset,
      this.y * Cell.cellSize + Cell.cellSize / 2 + 40
    );
    // TODO: remove me ---------------
  };
}
