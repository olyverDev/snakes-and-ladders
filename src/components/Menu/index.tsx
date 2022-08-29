import './Menu.css';

type MenuProps = {
  play: () => unknown;
};

function Menu({ play }: MenuProps) {
  return (
    <div className="Menu">
      <button onClick={play}>Play</button>
    </div>
  );
}

export default Menu;
