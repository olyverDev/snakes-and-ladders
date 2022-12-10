import React from 'react';

import './styles.css';

type Props = {
  onClick: () => void;
  children: React.ReactNode;
}

export const ModalButton = ({ children, onClick, ...props }: Props) => {
  return <button className='ModalButton' onClick={onClick} {...props}>{children}</button>;
};
