import Login from '../../pages/components/login/Login';
import GameSelect from '../../pages/components/game_select/GameSelect';
import Tournament from '../../pages/components/tournament/Tournament.js';
import Remote from '../../pages/components/remote/Remote.js';
import Local from '../../pages/components/Local.js';
import Game from '../../pages/components/game/Game.js';

export const BASE_URL = 'https://localhost:3000';

export const routes = [
	{ path: /^\/$/, element: Login },
	{ path: /^\/login$/, element: Login },
	{ path: /^\/select$/, element: GameSelect },
	{ path: /^\/local$/, element: Local },
	{ path: /^\/tournament$/, element: Tournament },
	{ path: /^\/remote$/, element: Remote },
	{ path: /^\/game$/, element: Game },
];
