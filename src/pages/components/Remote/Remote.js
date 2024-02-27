import Component from '../../../core/Component.js';
import Search from './RemoteSearch.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none',
			region: 'en'
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
		new Search(document.querySelector('.mainbox'), this.$state);
	}
}
