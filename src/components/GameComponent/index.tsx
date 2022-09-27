import { useCallback, useEffect, useMemo, useRef } from 'react';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { useWindowResize } from '../../utils';
import Dice from '../Dice';
import './GameComponent.css';

function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => new Game(), []);

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.setCellSize(canvasSize / game.size);
      game.render();
    }
  }, [canvasRef.current, game]);

  useEffect(() => {
    if (canvasRef.current && game) {
      game.init(canvasRef.current);
      onResize();
      game.render();
    }
  }, [onResize]);

  useWindowResize(onResize);
  return (
    <div className="GameComponent">
      <canvas ref={canvasRef} className="Canvas" />
      <Dice />
    </div>
  );
}

export default GameComponent;
