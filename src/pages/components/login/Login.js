import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';

export default class extends Component {
	setup() {
		this.$state = {
			progress: 'oauth',
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

	mounted() {
		if (this.$store.state.isLogged === true) {
			this.$state.progress = 'twoFA';
		}

		if (this.$store.state.isTwoFA === true) {
			this.$state.progress = 'language';
		}

		const $parent = this.$target.querySelector('.login-content-wrapper');
		if (this.$state.progress === 'oauth') {
			new OauthBtn($parent, this.$store);
		} else if (this.$state.progress === 'twoFA') {
			new TFABtn($parent, this.$store);
		} else if (this.$state.progress === 'language') {
			new SelectLanguage($parent, this.$store);
		}

		if (this.$props.region) this.$state.region = this.$props.region;

		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');

		if (code !== undefined) {
			const data = http.post('https://localhost:8000/api/auth/login/', {
				code: code,
			});
			console.log(data);
			if (data.login === 'success') {
				this.$store.dispatch('login');
				window.location.hash('#/login');
			}
		}
	}
}
