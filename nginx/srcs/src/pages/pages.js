import Login from './components/Login.js';
import GameSelect from './components/GameSelect.js';

export default (main) => {
	const login = () => new Login(main);
	const gameSelect = () => new GameSelect(main);
	const local = () => null;
	const tournament = () => null;
	const remote = () => null;
	const game = () => null;

	return {
		login,
		gameSelect,
		local,
		tournament,
		remote,
		game,
	};
};
