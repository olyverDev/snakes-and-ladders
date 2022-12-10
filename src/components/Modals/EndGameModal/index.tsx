import React from 'react';
import { useTranslation } from 'react-i18next';
import GameModal from '../GameModal';

type Props = {
  onClose: () => void;
}

const EndGameModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.endGame.restart');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <span>{t('modals.endGame.title')} </span>
    </GameModal>
  )
}

export default EndGameModal;
