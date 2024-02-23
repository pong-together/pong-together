export default {
	/*
	예시코드
	addItem(context, payload) {
		context.commit('addItem', payload);
	},
	clearItem(context, payload) {
		context.commit('clearItem', payload);
	},
	*/
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
};
