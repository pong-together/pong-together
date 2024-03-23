export default {
	changeLanguage(context, payload) {
		context.commit('changeLanguage', payload);
	},

	changeLoginProgress(context, payload) {
		context.commit('changeLoginProgress', payload);
	},

	changeIntraId(context, payload) {
		context.commit('changeIntraId', payload);
	},

	changeIntraImg(context, payload) {
		context.commit('changeIntraImg', payload);
	},

	changeWinCount(context, payload) {
		context.commit('changeWinCount', payload);
	},

	changeLoseCount(context, payload) {
		context.commit('changeLoseCount', payload);
	},

	gameModeChange(context, payload) {
		context.commit('gameModeChange', payload);
	},

	gameLevelChange(context, payload) {
		context.commit('gameLevelChange', payload);
	},

	changeTournamentId(context, payload) {
		context.commit('changeTorunamentId', payload);
	},
};
