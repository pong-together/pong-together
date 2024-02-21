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
		console.log('change login process');
		context.commit('changeLoginProgress', payload);
	},

	gameModeChange(context, payload) {
		context.commit('gameModeChange', payload);
	},

	gameLevelChange(context, payload) {
		context.commit('gameLevelChange', payload);
	},
};
