import Component from '../../../core/Component.js';
import { navigate } from '../../../router/utils/navigate.js';
import Search from './RemoteSearch.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
			navigate('/login');
		}

		this.$state = {
			remoteState: 'none',
			region: 'kr',
		};

		if (window.localStorage.getItem('language')) {
			this.$state.region = window.localStorage.getItem('language');
		}
	}

	template() {
		return `
			<div class="main-container">
				<div class="container">
					<div class="mainbox"></div>
				</div>
			</div>
		`;
	}

	mounted() {
		new Search(document.querySelector('.mainbox'), this.$state);
	}
}
