import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import coverWithoutLogo from '../../assets/cover-without-logo-min.jpg';
import cover from '../../assets/cover-min.jpg';

import './Menu.css';

type MenuProps = {
  loading: boolean;
  onPlayStart: () => unknown;
};

function Menu({ loading, onPlayStart }: MenuProps) {
  const { t } = useTranslation();
  const [coverVisibility, setCoverVisibility] = useState<'hidden' | 'visible'>('visible');

  useEffect(() => {
    setTimeout(() => {
      if (loading) return;
      setCoverVisibility('hidden');
      onPlayStart();
    }, 2500);
  }, [loading]);

  const coverInlineStyles = useMemo(() => ({
    visibility: coverVisibility,
  }), [coverVisibility]);

  return (
    <div className="Menu">
      <img style={coverInlineStyles} className="Cover" src={import.meta.env.VITE_IS_PROMO_GAME_VERSION === 'true' ? cover : coverWithoutLogo} />
    </div>
  );
}

export default Menu;
