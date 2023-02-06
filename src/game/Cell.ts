import { GameImagesService } from '../gameImagesService';
import { GAME_SIZE } from '../utils';
import { GameObject, GameObjectTypes } from './GameObject';

const { collection: images } = GameImagesService;

export class Cell extends GameObject {
  isLast = false;

  constructor(x: number, y: number) {

    let image = null;
    if (x % 2 !== 0) {
      image = y % 2 === 0 ? images.redCell : images.blueCell;
    } else {
      image = y % 2 !== 0 ? images.redCell : images.blueCell;
    }
    super({ image, x, y, id: Cell.currentId++, type: GameObjectTypes.cell });

    this.isLast = Cell.currentId === Math.pow(GAME_SIZE, 2);
  }

  static cellSize = 0;
  static currentId = 0;
  color = images.redCell;

  // renderCellNumeration = () => {
    // NOTE: cell numeration
    // const fontSize = Cell.cellSize / 6;
    // canvas.font = `${fontSize}px serif`;
    // canvas.fillStyle = 'white';
    // canvas.globalAlpha = 0.4;
    // canvas.fillText(
    //   '' + this.id + 1,
    //   this.x * Cell.cellSize + Cell.cellSize / 1.3,
    //   this.y * Cell.cellSize + Cell.cellSize / 5
    // );
    // canvas.globalAlpha = 1;
  // }

  renderLabels = (canvas: CanvasRenderingContext2D) => {
    /**
     * NOTE: there is no smart text rendering, just hardcoded values for Start / Finish words
     */
    const fontSize = Cell.cellSize / 4.5;
    canvas.font = `${fontSize}px Nunito`;
    canvas.fillStyle = '#C7C4B1';
    canvas.globalAlpha = 0.8;

    if (this.id === 0) {
      canvas.fillText(
        'START',
        this.x * Cell.cellSize + Cell.cellSize / 6,
        this.y * Cell.cellSize + Cell.cellSize / 1.6
      );
    }

    if (this.isLast) {
      canvas.fillText(
        'FINISH',
        this.x * Cell.cellSize + Cell.cellSize / 7.2,
        this.y * Cell.cellSize + Cell.cellSize / 1.6
      );
    }

    canvas.globalAlpha = 1;
  }

  render = (canvas: CanvasRenderingContext2D) => {
    if (!this.image) return;

    canvas.drawImage(
      this.image,
      this.x * Cell.cellSize,
      this.y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );

    this.renderLabels(canvas);
  };
}
