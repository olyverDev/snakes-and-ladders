import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameModeSelection } from '../../../utils';

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
  }

  const handleSelectVsPlayer = () => {
    onClose(GameModeSelection.VsPlayer);
  }

  return (
    <GameModal onClose={() => {}}>
      <span style={{ fontSize: 19 }}>{t('modals.selectGameMode.title')} </span>
      <div className='ButtonsWrap'>
        <ModalButton onClick={handleSelectVsBot}>{t('modals.selectGameMode.vsBot')}</ModalButton>
        <span className='BetweenButtonsSpace' />
        <ModalButton onClick={handleSelectVsPlayer}>{t('modals.selectGameMode.vsPlayer')}</ModalButton>
      </div>
    </GameModal>
  )
}

export default SelectGameModeModal;
