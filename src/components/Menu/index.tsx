import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Menu.css';

type MenuProps = {
  loading: boolean;
  onPlayPress: () => unknown;
};

function Menu({ loading, onPlayPress }: MenuProps) {
  const { t } = useTranslation();
  const [coverVisibility, setCoverVisibility] = useState<'hidden' | 'visible'>('visible');

  useEffect(() => {
    setTimeout(() => {
      if (loading) return;
      setCoverVisibility('hidden');
    }, 2500);
  }, [loading]);

  const coverInlineStyles = useMemo(() => ({
    visibility: coverVisibility,
  }), [coverVisibility]);

  return (
    <div className="Menu">
      <div style={coverInlineStyles} className="Cover" />
      {coverVisibility === 'hidden' && <button className="PlayButton" onClick={onPlayPress}>{t('play')}</button>}
    </div>
  );
}

export default Menu;
