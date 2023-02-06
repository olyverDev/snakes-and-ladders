import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import './styles.css';
import GameModal from '../GameModal';
import { IS_MOBILE_BROWSER } from '../../../utils';
import { ModalButton } from '../ModalButton';
import headphones from '../../../assets/headphones.png';
import { AnalyticsEvent, logAnalyticsEvent } from '../../../firebase';

type Props = {
  onClose: (withSound: boolean) => void;
}

const SoundCheckModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  const handleTurnSoundOn = () => {
    onClose(true);
    logAnalyticsEvent(AnalyticsEvent.GoLoud);
  };

  const handleClose = () => {
    if (IS_MOBILE_BROWSER) {
      onClose(false);
      logAnalyticsEvent(AnalyticsEvent.GoMuted);
      return;
    }

    onClose(true);
  }

  return (
    <GameModal onClose={handleClose}>
      {IS_MOBILE_BROWSER ? (
        <span className='SoundRecommendationMobile'>{t('modals.soundCheck.muted')} </span>
      ) : (
        <span className='SoundRecommendation'>{t('modals.soundCheck.title')} </span>
      )}
      <div className='HeadphonesImageWrap'>
        <img className='Headphones' width={100} height={100} style={{ opacity: 0.8 }} src={headphones} />
      </div>
      {IS_MOBILE_BROWSER ? (
        <>
          <ModalButton className='MainButton' onClick={handleTurnSoundOn}>{t('modals.soundCheck.soundOn')}</ModalButton>
          <ModalButton onClick={handleClose}>{t('modals.soundCheck.ignore')}</ModalButton>
        </>
      ) : (
        <ModalButton onClick={handleClose}>{t('modals.continueButton')}</ModalButton>
      )}
    </GameModal>
  )
}

export default SoundCheckModal;
