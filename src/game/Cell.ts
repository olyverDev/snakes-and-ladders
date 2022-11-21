import { GameImagesService } from '../gameImagesService';
import { GameObject, GameObjectTypes } from './GameObject';

const { collection: images } = GameImagesService;

export class Cell extends GameObject {
  constructor(x: number, y: number) {
    let image = null;
    if (x % 2 !== 0) {
      image = y % 2 === 0 ? images.redCell : images.blueCell;
    } else {
      image = y % 2 !== 0 ? images.redCell : images.blueCell;
    }
    super({ image, x, y, id: Cell.currentId++, type: GameObjectTypes.cell });
  }

  static cellSize = 0;
  static currentId = 0;
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

    const fontSize = Cell.cellSize / 6;
    canvas.font = `${fontSize}px serif`;
    canvas.fillStyle = 'white';
    canvas.globalAlpha = 0.4;
    canvas.fillText(
      '' + this.id,
      this.x * Cell.cellSize + Cell.cellSize / 1.3,
      this.y * Cell.cellSize + Cell.cellSize / 5
    );
    canvas.globalAlpha = 1;
  };
}
