import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { PlayerConfig } from '../../game/Game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import { getInitialPlayersConfig, useGameSounds, useWindowResize } from '../../utils';
import './GameComponent.css';

const Players = getInitialPlayersConfig();

new Game(Players);

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const [turnIndex, setTurnIndex] = useState(0);
  const activePlayer = useMemo(() => Players[turnIndex], [turnIndex]);
  const gameSounds = useGameSounds();

  useEffect(() => {
    if (activePlayer.automatic) {
      if (DiceRef.current)
        setTimeout(() => {
          DiceRef.current?.rollDice();
        }, 2000);
    }
  }, [activePlayer]);

  useEffect(() => {
    if (!game || game.loopInitialized) return;
    const gameLoop = gameLoopFactory([game.update, game.render]);
    window.requestAnimationFrame(() => {
      gameLoop(window.performance.now());
    });
    game.loopInitialized = true;
  }, [game]);

  const onRoll = useCallback(
    (countMoves: number) => {
      const isLastPlayer = turnIndex === Players.length - 1;
      const nextIndex = isLastPlayer ? 0 : turnIndex + 1;
      const nextPlayer = Players[nextIndex];

      game.setActivePlayerKey(nextPlayer.key);
      setTurnIndex(nextIndex);
      setHistory((previous) => [...previous, countMoves]);
      game.moveUser({ countMoves });
    },
    [turnIndex]
  );

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.cellSize = canvasSize / game.size;
    }
  }, [game]);

  useEffect(() => {
    if (game.isInitialized || !canvasRef.current || !game || !gameSounds) return;
    game.init(canvasRef.current, gameSounds);
    onResize();
  }, [onResize, gameSounds]);

  useWindowResize(onResize);

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        <Dice disabled={activePlayer.automatic} onRoll={onRoll} />
      </div>
    </div>
  );
}

export default GameComponent;
