import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

import './styles.css';

import vkLogo from '../../../assets/vk-logo.png';
import { Link } from '../../Link';

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
      <div className='Subtitle Conditions'>
        {t('modals.promo.endGame.contest.conditions.title')}
        {' '}
      </div>
      <Link href="https://vk.com/abchiphop">{t('modals.promo.endGame.contest.conditions.subscribe')}</Link>
      <a className='VkLogo' href="https://vk.com/abchiphop" target="_blank">
        <img width={55} height={55} src={vkLogo} />
      </a>
    </GameModal>
  )
}

export default PromoLeaveModal;
