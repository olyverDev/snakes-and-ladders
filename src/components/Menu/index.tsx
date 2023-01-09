import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
      <div style={coverInlineStyles} className="Cover" />
    </div>
  );
}

export default Menu;
