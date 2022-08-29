import { MutableRefObject } from 'react';
import './Canvas.css';

type CanvasProps = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
};

function Canvas({ canvasRef }: CanvasProps) {
  return <canvas ref={canvasRef} className="Canvas" />;
}

export default Canvas;
