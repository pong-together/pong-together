import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import http from '../../../core/http.js';
import store from '../../../store/index.js';

export default class extends Component {
	setEvent() {
		this.addEvent('click', '#login-oauth-btn', () => {
			window.location.href =
				'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9faf7925c4cf5dfe9518b96183f6225ad7c1c45e2f186121a5d808d8dcdad924&redirect_uri=https://localhost:443/&response_type=code';
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

		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code && !localStorage.getItem('accessToken')) {
			try {
				const btn = this.$target.querySelector('#login-oauth-btn');
				let loadingText = language.login[store.state.language].loading;
				btn.innerText = loadingText;
				let dotCount = 0;

				const loadingInterval = setInterval(() => {
					dotCount = (dotCount + 1) % 4;
					btn.innerText = loadingText + '.'.repeat(dotCount);
				}, 500);

				if (localStorage.getItem('accessToken')) {
					clearInterval(loadingInterval);
					store.dispatch('changeLoginProgress', 'twoFA');
					return;
				}

				const data = await http.post(
					'https://localhost:443/api/auth/login/',
					{ code: code },
					{ 'Content-Type': 'application/json' },
				);
				if (data.login === 'success') {
					clearInterval(loadingInterval);
					localStorage.setItem('accessToken', data.access_token);
					store.dispatch('changeLoginProgress', 'twoFA');
				}
			} catch (error) {
				clearInterval(loadingInterval);
			}
		}
	}

	async mounted() {
		if (localStorage.getItem('accessToken')) return;
		await this.oauth();
	}
}
