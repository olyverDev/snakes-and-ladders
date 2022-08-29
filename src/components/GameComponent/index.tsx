import { Ref, useEffect, useMemo, useRef } from 'react';
import Game from '../../game';
import Canvas from '../Canvas';
import './GameComponent.css';

function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => new Game().init(), []);
  useEffect(() => {}, []);
  return (
    <div className="GameComponent">
      GameComponent
      <Canvas canvasRef={canvasRef} />
    </div>
  );
}

export default GameComponent;
