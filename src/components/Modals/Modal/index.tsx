import React from 'react';
import ReactModal from 'react-modal';

import './styles.css';

ReactModal.setAppElement('#root');

type Props = {
  isOpen: boolean;
  label?: string;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, label, onClose, children, ...props }: Props) => (
  <ReactModal
    isOpen={isOpen}
    contentLabel={label}
    className="Modal"
    onRequestClose={onClose}
    {...props}
  >
    {children}
  </ReactModal>
);

export default Modal;
