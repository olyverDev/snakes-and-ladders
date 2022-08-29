import BlueCell from './assets/blue_cell.png';
import RedCell from './assets/red_cell.png';

const blue_image = new Image();
const red_image = new Image();

blue_image.src = BlueCell;
red_image.src = RedCell;

export const CELL_COLORS = {
  BLUE: blue_image,
  RED: red_image,
}
