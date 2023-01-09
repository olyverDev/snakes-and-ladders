import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import './styles.css';
import GameModal from '../GameModal';
import { isMobileBrowser } from '../../../utils';
import { ModalButton } from '../ModalButton';
import headphones from '../../../assets/headphones.png';

type Props = {
  onClose: (withSound: boolean) => void;
}

const SoundCheckModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const isMobile = useMemo(() => isMobileBrowser(), []);


  const handleTurnSoundOn = () => {
    onClose(true);
  };

  const handleClose = () => {
    if (isMobile) {
      onClose(false);
      return;
    }

    onClose(true);
  }

  return (
    <GameModal onClose={handleClose}>
      {isMobile ? (
        <span className='SoundRecommendationMobile'>{t('modals.soundCheck.muted')} </span>
      ) : (
        <span className='SoundRecommendation'>{t('modals.soundCheck.title')} </span>
      )}
      <div className='HeadphonesImageWrap'>
        <img className='Headphones' width={100} height={100} style={{ opacity: 0.8 }} src={headphones} />
      </div>
      {isMobile ? (
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