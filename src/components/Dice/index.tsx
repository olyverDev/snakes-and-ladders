import DiceComponent from 'react-dice-roll';
import { createRef } from 'react';

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

const Dice = ({ disabled = false, onRoll }: DicePropsType) => (
  <div className="DiceContainer">
    <DiceComponent disabled={disabled} ref={DiceRef} onRoll={onRoll} size={100} />
    <div className="DiceLabel">Tap to roll the Dice</div>
  </div>
);

export default Dice;
