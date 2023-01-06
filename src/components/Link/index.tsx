import React from 'react';

import './styles.css';

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLAnchorElement>;

export const Link = ({ children, className = '', ...props }: Props) => (
  <a target="_blank" {...props} className={`Link ${className}`} >{children}</a>
);
