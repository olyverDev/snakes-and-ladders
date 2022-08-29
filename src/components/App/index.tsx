import { ReactElement, useState } from 'react';
import Canvas from '../Canvas';
import Menu from '../Menu';
import Player from '../Player';
import './App.css';

const renderMenu = (): ReactElement => <Menu />;

const renderGame = (): ReactElement => (
  <div className="">
    <Player />
    <Canvas />
  </div>
);

const SCREENS = {
  MENU: renderMenu,
  GAME: renderGame,
};

function App() {
  const [currentRoute] = useState<ReactElement>(
    SCREENS.GAME
  );

  return <div className="App">{currentRoute}</div>;
}

export default App;
