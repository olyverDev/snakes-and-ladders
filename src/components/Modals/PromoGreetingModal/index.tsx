import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnalyticsEvent, logAnalyticsEvent } from '../../../firebase';
import { Link } from '../../Link';

import GameModal from '../GameModal';

import './styles.css';

type Props = {
  onClose: () => void;
}

const PromoGreetingModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.promo.greeting.go');
  const handleBandLinkClick = () => {
    logAnalyticsEvent(AnalyticsEvent.GoToBandLink);
  }

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
        <p className='Para'>{t('modals.promo.greeting.title')}</p>
        <p className='Para'>
          {t('modals.promo.greeting.part1')}
          {' '}
          <Link href="https://band.link/abchiphop" onClick={handleBandLinkClick}>abc хип-хоп</Link>
          {t('modals.promo.greeting.part2')}
        </p>
        <p className='Para'>
          {t('modals.promo.greeting.part3')}{' '}
          <span className='TextWinCondition'>{t('modals.promo.greeting.part4')}</span>{' '}
          {t('modals.promo.greeting.part5')}{' '}
          <span className='TextContest'>{t('modals.promo.greeting.part6')}</span>{' '}
          {t('modals.promo.greeting.part7')}
        </p>
        <p className='Para'>{t('modals.promo.greeting.part8')}</p>
    </GameModal>
  )
}

export default PromoGreetingModal;
