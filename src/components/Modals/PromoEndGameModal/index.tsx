import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

import './styles.css';

import vkLogo from '../../../assets/vk-logo.png';
import { Link } from '../../Link';

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
      <div className='Subtitle'>{t('modals.promo.endGame.contest.prize.title')}</div>
      <ul className='List'>
        <li>{t('modals.promo.endGame.contest.prize.gold')}</li>
        <li>{t('modals.promo.endGame.contest.prize.silver')}</li>
        <li>{t('modals.promo.endGame.contest.prize.bronze')}</li>
      </ul>
      <div className='Subtitle Conditions'>
        {t('modals.promo.endGame.contest.conditions.title')}
        {' '}
        <Link href="https://vk.com/abchiphop">{t('modals.promo.endGame.contest.conditions.subscribe')}</Link>
      </div>
      <a href="https://vk.com/abchiphop" target="_blank">
        <img width={60} height={60} src={vkLogo} />
      </a>
    </GameModal>
  )
}

export default PromoEndGameModal;
