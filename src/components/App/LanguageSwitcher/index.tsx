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
      <span onClick={selectLanguageFactory('ru')} className={classNameFactory('ru')}>🇷🇺</span>
      <span onClick={selectLanguageFactory('en')} className={classNameFactory('en')}>🇺🇸</span>
    </div>
  )
};

export default LanguageSwitcher;
