import Component from '../../../core/Component.js';
import Canvas from './Canvas.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		}
	}

	template() {
		return `
			<canvas id="canvas"></canvas>
		`;
	}

	mounted() {
		Canvas();
	}
}
