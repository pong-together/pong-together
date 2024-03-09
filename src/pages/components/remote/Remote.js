import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import RemoteSearch from './RemoteSearch.js';
import store from '../../../store/index.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		} else {
			http.checkToken();
		}

		this.$state = {
			region: 'kr',
			type: 'undefined',
			typeID: 'undefined',
			intraID: 'undefined',
		};
		localStorage.setItem('mode', store.state.gameLevel);
		console.log(localStorage.getItem('mode'));

		if (localStorage.getItem('language')) {
			this.$state.region = localStorage.getItem('language');
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
		new RemoteSearch(document.querySelector('.mainbox'), this.$state);
	}
}
