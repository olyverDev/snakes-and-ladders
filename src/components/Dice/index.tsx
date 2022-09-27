import './Dice.css';

import DiceComponent from 'react-dice-roll';

function Dice() {
  return (
    <div className="DiceContainer">
      <DiceComponent size={100}/>
    </div>
  );
}

export default Dice;
