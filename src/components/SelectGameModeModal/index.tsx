import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';
import { ModalButton } from '../ModalButton';

import './styles.css';

type Props = {
  onClose: (mode: string) => void;
}

const SelectGameModeModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  const handleSelectVsBot = () => {
    onClose('vsBot');
  }

  const handleSelectVsPlayer = () => {
    onClose('vsPlayer');
  }

  return (
    <GameModal onClose={() => {}}>
      <span>{t('modals.selectGameMode.title')} </span>
      <div>
        <ModalButton onClick={handleSelectVsBot}>{t('modals.selectGameMode.vsBot')}</ModalButton>
        <span className='BetweenButtonsSpace' />
        <ModalButton onClick={handleSelectVsPlayer}>{t('modals.selectGameMode.vsPlayer')}</ModalButton>
      </div>
    </GameModal>
  )
}

export default SelectGameModeModal;
