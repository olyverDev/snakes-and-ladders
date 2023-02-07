import { useTranslation } from 'react-i18next';
import { cx } from '../../../utils';

import './styles.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const lng = i18n.language;

  const selectLanguageFactory = (elementLng: string) => () => {
    i18n.changeLanguage(elementLng);
  };

  const classNameFactory = (elementLng: string) => `${cx('LanguageBlock')} ${lng === elementLng ? 'LanguageActive' : ''}`;

  return (
    <div className={cx('LanguageSwitcher')}>
      <span onClick={selectLanguageFactory('ru')} className={classNameFactory('ru')}>&#127479;&#127482;</span>
      <span onClick={selectLanguageFactory('en')} className={classNameFactory('en')}>&#127482;&#127480;</span>
    </div>
  )
};

export default LanguageSwitcher;
