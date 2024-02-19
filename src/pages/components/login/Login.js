import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			progress: 'oauth',
			oauthInProgress: false,
		};
		this.$store = this.$props;
	}

	template() {
		return `
		<div class="login-body-wrapper">
			<img src="../../../static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper"></div>
		</div>
		`;
	}

	async oauth() {
		if (localStorage.getItem('accessToken')) return;
		if (this.$state.oauthInProgress) return;
		this.$state.oauthInProgress = true;

		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');
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
					this.$store.dispatch('isLogin', true);
					window.location.hash('#/login');
				} else if (data.login === 'fail') {
					this.$store.dispatch('isTwoFA', true);
				}
			} catch (error) {
				console.error('HTTP 요청 실패:', error);
			}
		}
		this.oauthInProgress = false;
	}

	async mounted() {
		const $parent = this.$target.querySelector('.login-content-wrapper');
		if (this.$state.progress === 'oauth') {
			new OauthBtn($parent, this.$store);
			if (!localStorage.getItem('accessToken')) {
				await this.oauth();
			}
		} else if (this.$state.progress === 'twoFA') {
			new TFABtn($parent, this.$store);
		} else if (this.$state.progress === 'language') {
			new SelectLanguage($parent, this.$store);
		}

		if (this.$props.region) this.$state.region = this.$props.region;
	}
}
