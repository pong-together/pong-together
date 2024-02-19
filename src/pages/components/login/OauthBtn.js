import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			success: 'ananymous',
		};
		this.$store = this.$props;
	}

	setEvent() {
		this.addEvent('click', '#login-oauth-btn', () => {
			window.location.href =
				'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9faf7925c4cf5dfe9518b96183f6225ad7c1c45e2f186121a5d808d8dcdad924&redirect_uri=https://localhost:443/&response_type=code';
		});
	}

	template() {
		return `<button class="login-btn" id="login-oauth-btn">${language.login[this.$store.state.language].loginBtn}</button>`;
	}

	async oauth() {
		if (localStorage.getItem('accessToken')) return;

		const queryParams = await new URLSearchParams(window.location.search);
		const code = await queryParams.get('code');

		if (code) {
			try {
				const data = await http.post(
					'https://localhost:443/api/auth/login/',
					{ code: code },
					{ 'Content-Type': 'application/json' },
				);
				console.log('data', data);
				if (data.login === 'success') {
					localStorage.setItem('accessToken', data.access_token);
					this.$store.dispatch('changeLoginProgress', 'twoFA');
				}
			} catch (error) {
				console.error('HTTP 요청 실패:', error);
			}
		} else {
			console.log('code가 존재하지 않습니다.');
		}
	}

	async mounted() {
		if (localStorage.getItem('accessToken')) return;
		await this.oauth();
	}
}
