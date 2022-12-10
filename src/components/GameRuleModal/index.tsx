import React from 'react';
import { useTranslation } from 'react-i18next';

import ladder from '../../assets/ladder-right.png';
import snake from '../../assets/snake.png';
import coffin from '../../assets/coffin.png';
import praiseHands from '../../assets/praise-hands.png';
import snakesNest from '../../assets/snakes-nest.png';

import './styles.css';
import GameModal from '../GameModal';

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
  const buttonLabel = t('modals.continueButton');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
        <span>{t('modals.rules.title')} </span>
        <div className='GameObjectsGrid'>
          <GameObjectExplanation src={ladder}>{t('modals.rules.ladder')}</GameObjectExplanation>
          <GameObjectExplanation src={snake}>{t('modals.rules.snake')}</GameObjectExplanation>
          <GameObjectExplanation src={praiseHands}>{t('modals.rules.praiseHands')}</GameObjectExplanation>
          <GameObjectExplanation src={snakesNest}>{t('modals.rules.snakesNest')}</GameObjectExplanation>
          <GameObjectExplanation src={coffin}>{t('modals.rules.coffin')}</GameObjectExplanation>
        </div>
    </GameModal>
  )
}

export default GameRuleModal;
