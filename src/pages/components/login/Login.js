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

	mounted() {
		const $parent = this.$target.querySelector('.login-body-wrapper');

		if (store.state.loginProgress === 'done') {
			const newFragment = '#/select';
			const newUrl = window.location.pathname + newFragment;
			window.history.pushState({ path: newUrl }, '', newUrl);
			//window.location.hash = '#/select';
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
