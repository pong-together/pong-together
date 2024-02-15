import Login from './components/Login.js';
import GameSelect from './components/GameSelect.js';
import Tournament from './components/Tournament.js';
import Remote from './components/Remote.js';

export default (main) => {
	const login = () => new Login(main);
	const gameSelect = () => new GameSelect(main);
	const local = () => null;
	const tournament = () => new Tournament(main);
	const remote = () => new Remote(main);
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
