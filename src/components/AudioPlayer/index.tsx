import { useCallback, useState } from 'react';
import ReactPlayer from 'react-player';

import { Platform, PLATFORMS } from './constants';
import './styles.css';

type PlatformButtonProps = {
  active?: boolean;
  id: Platform;
  label: string;
  onClick: (platform: Platform) => void;
}

const PlatformButton = ({ active = false, id, label, onClick }: PlatformButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [id]);
  const className = active ? 'button button-active' : 'button';

  return (
    <button className={className} onClick={handleClick}>{label}</button>
  );
}

function AudioPlayer() {
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.Chill);
  const currentUrl = PLATFORMS[activePlatform].url;

  return (
    <div className="Container">
      <div className="buttons">
        {Object.values(PLATFORMS).map(({ id, label }) => (
          <PlatformButton
            key={id}
            active={id === activePlatform}
            id={id}
            label={label}
            onClick={setActivePlatform}
          />
        ))}
      </div>
      <div className="AudioPlayerWrapper">
        <ReactPlayer
          loop
          playing
          controls
          url={currentUrl}
          className="ReactPlayer"
          width="100%"
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
