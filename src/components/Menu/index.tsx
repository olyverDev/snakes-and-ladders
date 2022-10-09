import './Menu.css';

type MenuProps = {
  loading: boolean;
  play: () => unknown;
};

function Menu({ loading, play }: MenuProps) {
  return (
    <div className="Menu">
      <button disabled={loading} onClick={play}>{loading ? 'Loading...' : 'Play'}</button>
    </div>
  );
}

export default Menu;
