import Component from '../../../core/Component.js';
import OauthBtn from './OauthBtn.js';
import SelectLanguage from './SelectLanguage.js';
import TFABtn from './TFABtn.js';
import store from '../../../store/index.js';

export default class extends Component {
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

		if (store.state.loginProgress === 'oauth') {
			new OauthBtn($parent);
		}
		if (store.state.loginProgress === 'twoFA') {
			new TFABtn($parent);
		}
		if (store.state.loginProgress === 'language') {
			new SelectLanguage($parent);
		}
		console.log(store.state.loginProgress);
	}
}
