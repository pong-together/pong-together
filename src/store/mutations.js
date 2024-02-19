export default {
	/*
	예시코드
	addItem(state, payload) {
		state.items.push(payload);

		return state;
	},
	clearItem(state, payload) {
		state.items.splice(payload.index, 1);

		return state;
	},
*/
	changeLanguage(state, payload) {
		state.language = payload;
		return state;
	},
	isLogin(state, payload) {
		state.isLogged = payload;
		return state;
	},
	isTwoFA(state, payload) {
		state.isTwoFA = payload;
		return state;
	},
	gameModeChange(state, payload) {
		state.gameMode = payload;
		return state;
	},
	gameLevelChange(state, payload) {
		state.gameLevel = payload;
		return state;
	},
};
