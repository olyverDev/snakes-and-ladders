import React from 'react';

import './styles.css';

type Props = {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const ModalButton = ({ className = '', children, onClick, ...props }: Props) => {
  return <button className={`ModalButton ${className}`} onClick={onClick} {...props}>{children}</button>;
};
