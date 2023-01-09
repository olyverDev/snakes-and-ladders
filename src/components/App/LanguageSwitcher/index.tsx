import { useTranslation } from 'react-i18next';

import './styles.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const lng = i18n.language;

  const selectLanguageFactory = (elementLng: string) => () => {
    i18n.changeLanguage(elementLng);
  };

  const classNameFactory = (elementLng: string) => `LanguageBlock ${lng === elementLng ? 'LanguageActive' : ''}`;

  return (
    <div className='LanguageSwitcher'>
      <span onClick={selectLanguageFactory('ru')} className={classNameFactory('ru')}>🇷🇺</span>
      <span onClick={selectLanguageFactory('en')} className={classNameFactory('en')}>🇺🇸</span>
    </div>
  )
};

export default LanguageSwitcher;
