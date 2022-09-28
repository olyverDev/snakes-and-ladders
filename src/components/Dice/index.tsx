import './Dice.css';

import DiceComponent from 'react-dice-roll';

type DicePropsType = {
  onRoll: (newValue: number) => void;
};

const Dice = ({ onRoll }: DicePropsType) => (
  <div className="DiceContainer">
    <DiceComponent onRoll={onRoll} size={100} />
    <div className="DiceLabel">Tap to roll the Dice</div>
  </div>
);

export default Dice;
