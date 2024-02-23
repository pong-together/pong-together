import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';
import store from '../../../store/index.js';

export default class extends Component {
	setup() {
		if (localStorage.getItem('language')) {
			store.dispatch('changeLanguage', localStorage.getItem('language'));
		}
		store.events.subscribe('loginProgressChange', async () => this.render());
	}

	template() {
		return `
		<div class="login-body-wrapper">
		</div>
		`;
	}

	async mounted() {
		const $parent = this.$target.querySelector('.login-body-wrapper');

		if (store.state.loginProgress === 'done') {
			try {
				const accessToken = 'Bearer ' + localStorage.getItem('accessToken');
				const data = await http.get('https://localhost:443/api/userinfo/id/', {
					Authorization: accessToken,
					'Content-Type': 'application/json',
				});
				localStorage.setItem('intraId', data.intraId);
				store.dispatch('changeIntraId', data.intraId);
				localStorage.setItem('winCount', data.win_count);
				store.dispatch('changeWinCount', data.win_count);
				localStorage.setItem('loseCount', data.lose_count);
				store.dispatch('changeLoseCount', data.lose_count);
				localStorage.setItem('intraImg', data.image);
				store.dispatch('changeIntraImg', data.image);
			} catch (e) {}
			window.location.hash = '#/select';
		}
		if (store.state.loginProgress === 'oauth') {
			new OauthBtn($parent);
		}
		if (store.state.loginProgress === 'twoFA') {
			new TFABtn($parent);
		}
		if (store.state.loginProgress === 'language') {
			new SelectLanguage($parent);
		}
	}
}
