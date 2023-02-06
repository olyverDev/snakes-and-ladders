import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnalyticsEvent, logAnalyticsEvent } from '../../../firebase';
import { cx, GameModeSelection, IS_PROMO_GAME_VERSION } from '../../../utils';

import GameModal from '../GameModal';
import { ModalButton } from '../ModalButton';

import './styles.css';

type Props = {
  onClose: (mode: GameModeSelection) => void;
}

const SelectGameModeModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  const handleSelectVsBot = () => {
    onClose(GameModeSelection.VsBot);
    logAnalyticsEvent(AnalyticsEvent.PlayWithBot, { promo: IS_PROMO_GAME_VERSION });
  }

  const handleSelectVsPlayer = () => {
    onClose(GameModeSelection.VsPlayer);
    logAnalyticsEvent(AnalyticsEvent.PlayWithFriend, { promo: IS_PROMO_GAME_VERSION });
  }

  return (
    <GameModal onClose={() => {}}>
      <span style={{ fontSize: 19 }}>{t('modals.selectGameMode.title')} </span>
      <div className={cx('ButtonsWrap')}>
        <ModalButton onClick={handleSelectVsBot}>{t('modals.selectGameMode.vsBot')}</ModalButton>
        <span className='BetweenButtonsSpace' />
        <ModalButton onClick={handleSelectVsPlayer}>{t('modals.selectGameMode.vsPlayer')}</ModalButton>
      </div>
    </GameModal>
  )
}

export default SelectGameModeModal;
