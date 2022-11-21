import { useTranslation } from 'react-i18next';

import './Menu.css';

type MenuProps = {
  loading: boolean;
  play: () => unknown;
};

function Menu({ loading, play }: MenuProps) {
  const { t } = useTranslation();
  return (
    <div className="Menu">
      <button disabled={loading} onClick={play}>{loading ? t('loading') : t('play')}</button>
    </div>
  );
}

export default Menu;
