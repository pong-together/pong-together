import http from '../../../core/http.js';
const BASE_URL = import.meta.env.VITE_BASE_URL;

var id = 1;

const HEADERS = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
};

const TOURNAMENT_BASE_URL = `${BASE_URL}/api/tournament/`;

const list = (id) => {
	const BASE_URL_ID = TOURNAMENT_BASE_URL + id + '/';
	return http.get(BASE_URL_ID, HEADERS);
};

const create = (nicknames, gamemode) => {
	const list = {
		player1_name: nicknames[0],
		player2_name: nicknames[1],
		player3_name: nicknames[2],
		player4_name: nicknames[3],
		game_mode: gamemode,
	};

	return http.post(TOURNAMENT_BASE_URL, list, HEADERS);
};

export default {
	list,
	create,
};
