export abstract class GameObject {
  abstract render(canvas: CanvasRenderingContext2D): void;
  private x = 0;
  private y = 0;
  set X(x: number) {
    this.x = x;
  }
  set Y(y: number) {
    this.y = y;
  }
  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }
}
