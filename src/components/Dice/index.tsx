import DiceComponent from 'react-dice-roll';
import { createRef } from 'react';
import { useTranslation } from 'react-i18next';


import sound from '../../assets/roll-dice.mp3';
import './Dice.css';
import { cx, IS_MOBILE_BROWSER } from '../../utils';

type TValue = 1 | 2 | 3 | 4 | 5 | 6;

type TDiceRef = {
  rollDice: (value?: TValue) => void;
};

type DicePropsType = {
  muted?: boolean;
  disabled?: boolean;
  botLabel?: string;
  onRoll: (newValue: number) => void;
};

export const DiceRef = createRef<TDiceRef>();

const Dice = ({ muted = false, disabled = false, botLabel = '', onRoll }: DicePropsType) => {
  const { t } = useTranslation();
  const size = IS_MOBILE_BROWSER ? 57 : 90;
  return (
    <div className={cx('DiceContainer')}>
      <DiceComponent sound={muted ? undefined : sound} disabled={disabled} ref={DiceRef} onRoll={onRoll} size={size} />
      <div className="DiceLabel">{disabled ? t('wait') : (botLabel || t('dice.roll'))}</div>
    </div>
  );
}

export default Dice;
