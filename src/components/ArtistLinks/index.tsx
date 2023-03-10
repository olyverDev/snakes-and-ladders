import './styles.css';

import vkLogo from '../../assets/vk.png';
import spotifyLogo from '../../assets/spotify.png';
import yandexMusicLogo from '../../assets/yamusic.png';
import souncloudLogo from '../../assets/soundcloud.png';
import { cx } from '../../utils';

const LogoLink = ({ src, href, ...props }: Record<string, any>) => (
  <a className='ArtistLink' href={href} target="_blank">
    <img className='LinkImage' width={50} height={50} src={src} color="gray" {...props} />
  </a>
)

function ArtistLinks() {

  return (
    <div className={cx('ArtistLinks')}>
      <LogoLink src={vkLogo} href="https://vk.com/abchiphop" />
      <LogoLink src={souncloudLogo} href="https://soundcloud.com/abchiphop" />
      <LogoLink src={yandexMusicLogo} style={{ marginRight: '-12px' }} href="https://music.yandex.ru/artist/16875922" />
      <LogoLink src={spotifyLogo} href="https://open.spotify.com/artist/4iV9IdgiBpoI6YZri5PdYj?si=Czlfz_V4Rlyw7cIvOjkaQw&nd=1" />
    </div>
  );
}

export default ArtistLinks;
