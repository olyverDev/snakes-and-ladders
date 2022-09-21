import { useCallback, useState } from 'react';
import ReactPlayer from 'react-player';

import { Platform, PLATFORMS } from './constants';
import './styles.css';

type PlatformButtonProps = {
  id: Platform;
  label: string;
  onClick: (platform: Platform) => void;
}

const PlatformButton = ({ id, label, onClick }: PlatformButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [id]);

  return (
    <button className='button' onClick={handleClick}>{label}</button>
  );
}
 
function AudioPlayer() {
  const [activePlatform, setActivePlatform]= useState<Platform>(Platform.Chill);
  const currentUrl = PLATFORMS[activePlatform].url;

  return (
    <div className="AudioPlayerContainer">
      {currentUrl && <ReactPlayer playing controls url={currentUrl} />}
      <div className="buttons">
        {Object.values(PLATFORMS).map(({ id, label }) => <PlatformButton key={id} id={id} label={label} onClick={setActivePlatform} />)}
      </div>
    </div>
  );
}

export default AudioPlayer;
