import Login from './components/Login.js';
<<<<<<< HEAD
import GameSelect from './components/game_select/GameSelect.js';
=======
import GameSelect from './components/GameSelect.js';
<<<<<<< HEAD
>>>>>>> main
import Tournament from './components/Tournament.js';
import Remote from './components/Remote.js';
=======
import Tournament from './components/Tournament-Bracket.js';
import Local from './components/Local.js';
>>>>>>> main

export default (main) => {
	const login = () => new Login(main);
	const gameSelect = () => new GameSelect(main);
	const local = () => new Local(main);
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
