export default {
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
	changeTournamentId(state, payload) {
		state.torunamentId = payload;
		return state;
	}
};
