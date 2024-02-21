import Component from '../../../core/Component.js';
import Search from './RemoteSearch.js';

export default class extends Component {

	template() {
		return `
			<div class="container">
				<div class="mainbox"></div>
			</div>
		`;
	}

	mounted() {
		new Search();
	}
}
