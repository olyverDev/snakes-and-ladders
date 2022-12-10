import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

type Props = {
  isWinner: boolean;
  onClose: () => void;
}

const PromoEndGameModal = ({ isWinner, onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.continueButton');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <h4>{t('modals.endGame.title')} </h4>
      <h3>{isWinner ? t('modals.promo.endGame.grats') : t('modals.promo.endGame.relief')}</h3>
      <h2>{t('modals.promo.endGame.contest.conditions.title')}</h2>
      <ul>
        <li>{t('modals.promo.endGame.contest.conditions.first')}</li>
        <li>{t('modals.promo.endGame.contest.conditions.second')}</li>
        <li>{t('modals.promo.endGame.contest.conditions.third')}</li>
      </ul>
      <h2>{t('modals.promo.endGame.contest.prize.title')}</h2>
      <ul>
        <li>{t('modals.promo.endGame.contest.prize.gold')}</li>
        <li>{t('modals.promo.endGame.contest.prize.silver')}</li>
        <li>{t('modals.promo.endGame.contest.prize.bronze')}</li>
      </ul>
    </GameModal>
  )
}

export default PromoEndGameModal;
