import React from 'react';
import { useTranslation } from 'react-i18next';

import './styles.css';

import vkLogo from '../../assets/vk-logo.png';
import { Link } from '../Link';
import { AnalyticsEvent, logAnalyticsEvent } from '../../firebase';

const GoToContest = () => {
  const { t } = useTranslation();
  const handleSubscribeClick = () => {
    logAnalyticsEvent(AnalyticsEvent.SubscribeClick);
  }

  return (
    <>
      <div className='Subtitle Conditions'>
        {t('modals.promo.endGame.contest.conditions.title')}
        {' '}
      </div>
      <Link onClick={handleSubscribeClick} href="https://vk.com/abchiphop">{t('modals.promo.endGame.contest.conditions.subscribe')}</Link>
      <a onClick={handleSubscribeClick} className='VkLogo' href="https://vk.com/abchiphop" target="_blank">
        <img width={55} height={55} src={vkLogo} />
      </a>
    </>
  )
}

export default GoToContest;
