import Login from './components/Login.js';
import GameSelect from './components/GameSelect.js';
import Tournament from './components/Tournament-Bracket.js';
import Local from './components/Local.js';

export default (main) => {
	const login = () => new Login(main);
	const gameSelect = () => new GameSelect(main);
	const local = () => new Local(main);
	const tournament = () => new Tournament(main);
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
