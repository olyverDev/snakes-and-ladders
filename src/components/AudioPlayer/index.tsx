import { useCallback, useState } from 'react';
import ReactPlayer from 'react-player';
import { AnalyticsEvent, logAnalyticsEvent } from '../../firebase';

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
    logAnalyticsEvent(AnalyticsEvent.ChangePlatform, { platform: id })
    onClick(id)
  }, [id]);
  const className = active ? 'Button Button-active' : 'Button';

  return (
    <button className={className} onClick={handleClick}>{label}</button>
  );
}

function AudioPlayer({ muted = false }: { muted?: boolean }) {
  const [activePlatform, setActivePlatform] = useState<Platform>(Platform.Youtube);
  const currentUrl = PLATFORMS[activePlatform]?.url;
  const handlePause = () => {
    logAnalyticsEvent(AnalyticsEvent.PauseMusic);
  };
  const handlePlay = () => {
    logAnalyticsEvent(AnalyticsEvent.PlayMusic);
  }

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
      <ReactPlayer
        loop
        playing
        controls
        muted={muted}
        volume={0.8}
        url={currentUrl}
        width="100%"
        onPause={handlePause}
        onPlay={handlePlay}
      />
    </div>
  );
}

export default AudioPlayer;
