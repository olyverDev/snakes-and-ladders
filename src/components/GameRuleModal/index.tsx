import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ladder from '../../assets/ladder-right.png';
import snake from '../../assets/snake.png';
import coffin from '../../assets/coffin.png';
import praiseHands from '../../assets/praise-hands.png';
import snakesNest from '../../assets/snakes-nest.png';

import Modal from '../Modal';

import './styles.css';
import { ModalButton } from '../ModalButton';

type GameObjectExplanationProps = {
  src: string;
  children: string;
}
const GameObjectExplanation = ({ src, children }: GameObjectExplanationProps) => (
  <div className='GameObjectWrapper'>
    <img width={60} height={60} src={src} />
    <div className='GameObjectLabel'>{children}</div>
  </div>
);

type Props = {
  onClose: () => void;
}

const GameRuleModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='GameRuleModalContent'>
        <span className='GameRuleModalTitle'>{t('rules.base')} </span>
        <div className='GameObjectsGrid'>
          <GameObjectExplanation src={ladder}>{t('rules.ladder')}</GameObjectExplanation>
          <GameObjectExplanation src={snake}>{t('rules.snake')}</GameObjectExplanation>
          <GameObjectExplanation src={praiseHands}>{t('rules.praiseHands')}</GameObjectExplanation>
          <GameObjectExplanation src={snakesNest}>{t('rules.snakesNest')}</GameObjectExplanation>
          <GameObjectExplanation src={coffin}>{t('rules.coffin')}</GameObjectExplanation>
        </div>
        <ModalButton onClick={handleClose}>{t('rules.continueButton')}</ModalButton>
      </div>
    </Modal>
  )
}

export default GameRuleModal;
