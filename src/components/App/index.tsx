import { ReactElement, useCallback, useMemo, useState } from 'react';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import './App.css';

function App() {
  const renderMenu = useCallback(
    () => <Menu play={() => setCurrentRoute(SCREENS.GAME)} />,
    []
  );

  const SCREENS = useMemo(
    () => ({
      MENU: renderMenu,
      GAME: <GameComponent />,
    }),
    [renderMenu]
  );

  const [currentRoute, setCurrentRoute] = useState<ReactElement>(SCREENS.MENU);

  return <div className="App">{currentRoute}</div>;
}

export default App;
