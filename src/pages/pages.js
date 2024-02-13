import Login from '../pages/components/Login.js';

export default (main) => {
	const login = () => new Login(main);
	const gameSelect = () => null;
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
