import DiceComponent from 'react-dice-roll';
import { createRef } from 'react';
import { useTranslation } from 'react-i18next';


import sound from '../../assets/roll-dice.mp3';
import './Dice.css';

type TValue = 1 | 2 | 3 | 4 | 5 | 6;

type TDiceRef = {
  rollDice: (value?: TValue) => void;
};

type DicePropsType = {
  disabled?: boolean;
  onRoll: (newValue: number) => void;
};

export const DiceRef = createRef<TDiceRef>();

const Dice = ({ disabled = false, onRoll }: DicePropsType) => {
  const { t } = useTranslation();
  return (
    <div className="DiceContainer">
      <DiceComponent sound={sound} disabled={disabled} ref={DiceRef} onRoll={onRoll} size={90} />
      <div className="DiceLabel">{disabled ? t('wait') : t('rollDice')}</div>
    </div>
  );
}

export default Dice;
