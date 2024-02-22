import http from "../../../core/http.js";

var id = 1;

const HEADERS = {
	'Content-Type' : 'application/json',
	'Authorization' : `Bearer ${localStorage.getItem('accessToken')}`,
};

const BASE_URL = 'https://localhost:443/api/tournament/';

const list = (id) => {
	const BASE_URL_ID = BASE_URL + id + '/';
	return http.get(BASE_URL_ID, HEADERS);
}

const create = (nicknames) => {
	const list = {
		player1_name: nicknames[0],
		player2_name: nicknames[1],
		player3_name: nicknames[2],
		player4_name: nicknames[3]
	}

	return http.post(BASE_URL, list, HEADERS);
}

export default {
	list,
	create,
}