import Login from '../../pages/components/login/Login';
import GameSelect from '../../pages/components/game_select/GameSelect';
import Tournament from '../../pages/components/tournament/Tournament.js';
import Remote from '../../pages/components/remote/Remote.js';
import Local from '../../pages/components/local/Local.js';
import Game from '../../pages/components/game/Game.js';
import LoginRedirect from '../../pages/components/login/LoginRedirect';
import tournamentBracket from '../../pages/components/tournament/Tournament-Bracket.js';
import NotFound from '../../pages/components/NotFound.js';

export const routes = [
	{ path: /^\/$/, element: Login, key: 'login' },
	{ path: /^\/login$/, element: Login, key: 'login'},
	{ path: /^\/auth$/, element: LoginRedirect, key: 'auth'},
	{ path: /^\/select$/, element: GameSelect, key: 'select'},
	{ path: /^\/local$/, element: Local, key: 'local'},
	{ path: /^\/tournament$/, element: Tournament, key: 'tournament'},
	{ path: /^\/tournamentBracket$/, element: tournamentBracket, key: 'tournamentBracket'},
	{ path: /^\/remote$/, element: Remote, key: 'remote'},
	{ path: /^\/game$/, element: Game, key: 'game'},
	{ path: /^\/notfound$/, element: NotFound, key: 'notfound'}
];