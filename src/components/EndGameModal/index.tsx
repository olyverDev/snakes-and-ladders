import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../Modal';
import { ModalButton } from '../ModalButton';

import './styles.css';

type Props = {
  onClose: () => void;
}

const EndGameModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='EndGameModalContent'>
        <span className='EndGameModalTitle'>{t('endGame.title')} </span>
        <ModalButton onClick={handleClose}>{t('endGame.restart')}</ModalButton>
      </div>
    </Modal>
  )
}

export default EndGameModal;
