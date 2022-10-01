import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { useWindowResize } from '../../utils';
import './GameComponent.css';
import { allImagesLoaded, IMAGES } from '../../images';

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
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
  }, [game, imagesLoaded]);

  useEffect(() => {
    if (canvasRef.current && game && imagesLoaded) {
      game.init(canvasRef.current);
      onResize();
      game.render();
    }
  }, [onResize, imagesLoaded]);

  useWindowResize(onResize);
  useEffect(() => {
    allImagesLoaded.then((isLoaded) => {
      console.log({ IMAGES });

      setImagesLoaded(isLoaded);
      console.log(isLoaded);
      game.render();
    });
  }, []);

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        {!!imagesLoaded && <canvas ref={canvasRef} className="Canvas" />}
      </div>
      <div className="SideControls">
        <AudioPlayer /> {!!imagesLoaded && <Dice onRoll={onRoll} />}
      </div>
    </div>
  );
}

export default GameComponent;
