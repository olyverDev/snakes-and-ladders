import { Cell } from './Cell';
import { GameImagesService } from '../gameImagesService';
import { Game } from './Game';
import { User } from './User';
const { collection: images } = GameImagesService;

type CloudPropsType = { fromCell?: Cell; fromUser?: User; label?: string };

export class Cloud {
  fromCell?: Cell;
  fromUser?: User;
  label?: string;

  constructor({ fromCell, fromUser, label }: CloudPropsType) {
    if (!fromCell && !fromUser) throw new Error('Position not found!');
    this.fromCell = fromCell;
    this.fromUser = fromUser;
    this.label = label;
  }

  render = (canvas: CanvasRenderingContext2D) => {
    let x = 0;
    let y = 0;
    const { cellSize } = Cell;
    if (this.fromUser) {
      x = this.fromUser.x * cellSize + cellSize / 2;
      y = this.fromUser.y * cellSize + cellSize / 2;
    }
    if (this.fromCell) {
      x = this.fromCell.x * cellSize + cellSize / 2;
      y = this.fromCell.y * cellSize + cellSize / 2;
    }
    const canvasLeftBorder = cellSize * 1.5;
    const canvasRightBorder = (Game.object.map[0].length - 1.5) * cellSize;
    const canvasTopBorder = cellSize * 1.5;
    const canvasBottomBorder = (Game.object.map.length - 1.5) * cellSize;
    const isRightBottom =
      !(x >= canvasRightBorder) &&
      !(y >= canvasBottomBorder) &&
      'isRightBottom';
    const isRightTop =
      !(x >= canvasRightBorder) && !(y <= canvasTopBorder) && 'isRightTop';
    const isLeftBottom =
      !(x <= canvasLeftBorder) && !(y >= canvasBottomBorder) && 'isLeftBottom';
    const isLeftTop =
      !(x <= canvasLeftBorder) && !(y <= canvasTopBorder) && 'isLeftTop';
    const xOffset = cellSize / 7;
    const yOffset = cellSize * 1.5;
    const sizeX = cellSize * 1.5;
    const sizeY = cellSize * 1.5;
    const renderValues: Record<
      string,
      {
        scale: [number, number];
        renderProps: [HTMLImageElement, number, number, number, number];
      }
    > = {
      isRightTop: {
        scale: [1, 1],
        renderProps: [images.cloud, x - xOffset, y - yOffset, sizeX, sizeY],
      },
      isLeftTop: {
        scale: [-1, 1],
        renderProps: [images.cloud, -x - xOffset, y - yOffset, sizeX, sizeY],
      },
      isRightBottom: {
        scale: [1, -1],
        renderProps: [images.cloud, x - xOffset, -y - yOffset, sizeX, sizeY],
      },
      isLeftBottom: {
        scale: [-1, -1],
        renderProps: [images.cloud, -x - xOffset, -y - yOffset, sizeX, sizeY],
      },
    };

    const position = isRightTop || isLeftTop || isRightBottom || isLeftBottom || 'isRightTop';
    const currentSideDetails = renderValues[position];
  
    canvas.save();
    canvas.scale(...currentSideDetails.scale);
    canvas.drawImage(...currentSideDetails.renderProps);
    canvas.restore();


    if (this.label) {
      // just approximate-lucky-fitting to font coordinates
      const textStartPosition = {
        isRightTop: {
          x: x,
          y: y - cellSize / 1.5,
        },
        isLeftTop: {
          x: x - cellSize * 1.2,
          y: y - cellSize / 1.5,
        },
        isRightBottom: {
          x: x,
          y: y + cellSize / 1.2,
        },
        isLeftBottom: {
          x: x - cellSize * 1.2,
          y: y + cellSize / 1.2,
        },
      }
      const textPosition = textStartPosition[position];
      canvas.font = `${cellSize / 5}px Jost`;
      canvas.fillStyle = 'white';
      canvas.fillText(this.label, textPosition.x, textPosition.y);
    }
  };
}
