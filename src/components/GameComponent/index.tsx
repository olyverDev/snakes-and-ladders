import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { useWindowResize } from '../../utils';
import './GameComponent.css';

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => new Game(), []);

  const onRoll = useCallback((newValue: number) => {
    setHistory((previous) => [...previous, newValue]);
    game.moveUser(newValue);
  }, []);

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.setCellSize(canvasSize / game.size);
      game.render();
    }
  }, [game]);

  useEffect(() => {
    if (canvasRef.current && game) {
      game.init(canvasRef.current);
      onResize();
      game.render();
    }
  }, [onResize]);

  useWindowResize(onResize);

  useEffect(() => {
    game.render();
  }, []);

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        <Dice onRoll={onRoll} />
      </div>
    </div>
  );
}

export default GameComponent;
