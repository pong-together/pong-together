import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
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

	async mounted() {
		const $parent = this.$target.querySelector('.login-content-wrapper');

		if (this.$store.state.loginProgress === 'oauth') {
			new OauthBtn($parent, this.$store);
		} else if (this.$store.state.loginProgress === 'twoFA') {
			new TFABtn($parent, this.$store);
		} else if (this.$store.state.loginProgress === 'language') {
			new SelectLanguage($parent, this.$store);
		}
	}
}
