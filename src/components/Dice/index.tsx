import DiceComponent from 'react-dice-roll';
import { createRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';


import sound from '../../assets/roll-dice.mp3';
import './Dice.css';
import { isMobileBrowser } from '../../utils';

type TValue = 1 | 2 | 3 | 4 | 5 | 6;

type TDiceRef = {
  rollDice: (value?: TValue) => void;
};

type DicePropsType = {
  muted?: boolean;
  disabled?: boolean;
  onRoll: (newValue: number) => void;
};

export const DiceRef = createRef<TDiceRef>();

const Dice = ({ muted = false, disabled = false, onRoll }: DicePropsType) => {
  const { t } = useTranslation();
  const isMobile = useMemo(() => isMobileBrowser(), []);
  const size = isMobile ? 57 : 90;
  return (
    <div className="DiceContainer">
      <DiceComponent sound={muted ? undefined : sound} disabled={disabled} ref={DiceRef} onRoll={onRoll} size={size} />
      <div className="DiceLabel">{disabled ? t('wait') : t('rollDice')}</div>
    </div>
  );
}

export default Dice;
