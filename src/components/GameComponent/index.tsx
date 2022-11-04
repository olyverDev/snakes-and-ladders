import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import { useWindowResize } from '../../utils';
import './GameComponent.css';

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const game = useMemo(() => Game.object, []);

  useEffect(() => {
    if (!game || game.loopInitialized) return;
    const gameLoop = gameLoopFactory([game.update, game.render]);
    window.requestAnimationFrame(() => {
      gameLoop(window.performance.now());
    });
    game.loopInitialized = true;
  }, [game]);

  const onRoll = useCallback((countMoves: number) => {
    setHistory((previous) => [...previous, countMoves]);
    game.moveUser({ countMoves });
  }, []);

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.cellSize = canvasSize / game.size;
    }
  }, [game]);

  useEffect(() => {
    if (!canvasRef.current || !game || game.isInitialized) return;
    game.init(canvasRef.current);
    onResize();
  }, [onResize]);

  useWindowResize(onResize);

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
