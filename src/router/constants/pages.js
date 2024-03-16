import Login from '../../pages/components/login/Login';
import GameSelect from '../../pages/components/game_select/GameSelect';
import Tournament from '../../pages/components/tournament/Tournament.js';
import Remote from '../../pages/components/remote/Remote.js';
import Local from '../../pages/components/local/Local.js';
import Game from '../../pages/components/game/Game.js';
import LoginRedirect from '../../pages/components/login/LoginRedirect';

export const routes = [
	{ path: /^\/$/, element: Login, key: 'Login'},
	{ path: /^\/login$/, element: Login, key: 'Login'},
	{ path: /^\/auth$/, element: LoginRedirect, key: 'LoginRedirect'},
	{ path: /^\/select$/, element: GameSelect, key: 'GameSelect'},
	{ path: /^\/local$/, element: Local, key: 'Local'},
	{ path: /^\/tournament$/, element: Tournament, key: 'Tournament'},
	{ path: /^\/remote$/, element: Remote, key: 'Remote'},
	{ path: /^\/game$/, element: Game, key: 'Game'},
];
