import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import store from '../../../store/index.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class Auth extends Component {
	// static instance = null;

	// static getInstance($container) {
	// 	if (!Auth.instance) {
	// 		Auth.instance = new Auth($container);
	// 	}
	// 	return Auth.instance;
	// }

	setEvent() {
		this.addEvent('click', '#login-oauth-btn', () => {
			window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9faf7925c4cf5dfe9518b96183f6225ad7c1c45e2f186121a5d808d8dcdad924&redirect_uri=${BASE_URL}/auth&response_type=code`;
		});
	}

	template() {
		return `
		<img src="/static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper"><button class="login-btn" id="login-oauth-btn">${language.login[store.state.language].loginBtn}</button>
			</div>`;
	}

	async oauth() {
		if (localStorage.getItem('accessToken')) {
			store.dispatch('changeLoginProgress', 'twoFA');
			return;
		}
	}

	async mounted() {
		if (localStorage.getItem('accessToken')) return;
		await this.oauth();
	}
}
