import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

import './styles.css';

type Props = {
  isWinner: boolean;
  onClose: () => void;
}

const PromoEndGameModal = ({ isWinner, onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.continueButton');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <div className='GratsTitle'>{isWinner ? t('modals.promo.endGame.grats') : t('modals.promo.endGame.relief')}</div>
      <div className='Subtitle'>{t('modals.promo.endGame.contest.conditions.title')}</div>
      <ol className='List'>
        <li>{t('modals.promo.endGame.contest.conditions.first')}</li>
        <li>{t('modals.promo.endGame.contest.conditions.second')}</li>
        <li>{t('modals.promo.endGame.contest.conditions.third')}</li>
      </ol>
      <div className='Subtitle'>{t('modals.promo.endGame.contest.prize.title')}</div>
      <ul className='List'>
        <li>{t('modals.promo.endGame.contest.prize.gold')}</li>
        <li>{t('modals.promo.endGame.contest.prize.silver')}</li>
        <li>{t('modals.promo.endGame.contest.prize.bronze')}</li>
      </ul>
    </GameModal>
  )
}

export default PromoEndGameModal;
