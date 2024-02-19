import Login from './components/login/Login.js';
import Oauth from './components/login/Oauth.js';
import GameSelect from './components/game_select/GameSelect.js';
import Tournament from './components/Tournament.js';
import Remote from './components/Remote.js';
import Local from './components/Local.js';
import OauthBtn from './components/login/OauthBtn.js';

export default (main, props) => {
	const login = () => new Login(main, props);
	const oauth = () => new Oauth(main, props);
	const gameSelect = () => new GameSelect(main, props);
	const local = () => new Local(main, props);
	const tournament = () => new Tournament(main, props);
	const remote = () => new Remote(main, props);
	const game = () => null;

	return {
		login,
		oauth,
		gameSelect,
		local,
		tournament,
		remote,
		game,
	};
};
