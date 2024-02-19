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
				'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9faf7925c4cf5dfe9518b96183f6225ad7c1c45e2f186121a5d808d8dcdad924&redirect_uri=http://localhost:8080&response_type=code';
		});
	}

	template() {
		return `<button class="login-btn" id="login-oauth-btn">${language.login[this.$store.state.language].loginBtn}</button>`;
	}

	async mounted() {}
}
