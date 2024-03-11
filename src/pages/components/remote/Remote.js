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
		console.log('마운트가 한번만 되는지 확인하는 로그 : Remote');
		new RemoteSearch(document.querySelector('.mainbox'), this.$state);
	}
}
