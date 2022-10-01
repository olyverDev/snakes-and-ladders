import { ReactElement, useEffect, useMemo, useState } from 'react';

import { GameImagesService } from '../../gameImagesService';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import './App.css';

function App() {
  const { loaded: imagesLoaded } = GameImagesService.useLoad();

  const SCREENS = useMemo(
    () => ({
      MENU: <Menu loading={!imagesLoaded} play={() => setCurrentRoute(SCREENS.GAME)} />,
      GAME: <GameComponent />,
    }),
    [imagesLoaded]
  );

  const [currentRoute, setCurrentRoute] = useState<ReactElement>(SCREENS.MENU);

  useEffect(() => {
    setCurrentRoute(SCREENS.MENU);
  }, [SCREENS])

  return <div className="App">{currentRoute}</div>;
}

export default App;
