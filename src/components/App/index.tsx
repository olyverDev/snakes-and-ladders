import { ReactElement, useCallback, useMemo, useState } from 'react';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import Player from '../Player';
import './App.css';

const renderGame = (): ReactElement => (
  <div className="GameContainer">
    <Player />
    <GameComponent />
  </div>
);

function App() {
  const renderMenu = useCallback(
    () => <Menu play={() => setCurrentRoute(SCREENS.GAME)} />,
    []
  );

  const SCREENS = useMemo(
    () => ({
      MENU: renderMenu,
      GAME: renderGame,
    }),
    [renderMenu]
  );

  const [currentRoute, setCurrentRoute] = useState<ReactElement>(SCREENS.MENU);

  return <div className="App">{currentRoute}</div>;
}

export default App;
