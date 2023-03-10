import React, { useState } from 'react';

import Modal from '../Modal';
import { ModalButton } from '../ModalButton';

import './styles.css';

type Props = {
  buttonLabel?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const GameModal = ({ buttonLabel, children, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen}>
      <div className='GameModalContent'>
        {children}
        {buttonLabel && (
          <div className='ModalButtonWrap'>
            <ModalButton onClick={handleClose}>{buttonLabel}</ModalButton>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default GameModal;
