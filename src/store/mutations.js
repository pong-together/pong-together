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
	changeLoginProgress(state, payload) {
		state.loginProgress = payload;
		return state;
	},
	changeIntraId(state, payload) {
		state.intraId = payload;
		return state;
	},
	changeIntraImg(state, payload) {
		state.intraImg = payload;
		return state;
	},
	changeWinCount(state, payload) {
		state.winCount = payload;
		return state;
	},
	changeLoseCount(state, payload) {
		state.loseCount = payload;
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
