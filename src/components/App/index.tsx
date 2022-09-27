import { ReactElement, useCallback, useMemo, useState } from 'react';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import AudioPlayer from '../AudioPlayer';
import './App.css';
import Dice from '../Dice';

const renderGame = (): ReactElement => (
  <div className="GameContainer">
    <GameComponent />
    <div className="SideControls">
      <AudioPlayer />
      <Dice />
    </div>
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
