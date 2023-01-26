import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

import './styles.css';

import GoToContest from '../../GoToContest';

type Props = {
  onClose: () => void;
}

const PromoLeaveModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.continueButton');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <div className='LeaveTitle'>{t('modals.promo.leave.title')}</div>
      <div className='Subtitle'>{t('modals.promo.endGame.contest.prize.title')}</div>
      <ul className='List'>
        <li><span>{t('modals.promo.endGame.contest.prize.gold')} &#128176;&#128176;&#128176;</span></li>
        <li><span>{t('modals.promo.endGame.contest.prize.silver')} &#128176;&#128176; {t('modals.promo.endGame.contest.prize.silverTail')}</span></li>
        <li><span>{t('modals.promo.endGame.contest.prize.bronze')} &#128176; {t('modals.promo.endGame.contest.prize.bronzeTail')}</span></li>
      </ul>
      <GoToContest />
    </GameModal>
  )
}

export default PromoLeaveModal;
