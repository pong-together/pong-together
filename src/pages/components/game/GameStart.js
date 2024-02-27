import Component from '../../../core/Component.js';
import Canvas from './Canvas.js';

export default class extends Component {
	template() {
		return `
			<canvas id="canvas"></canvas>
		`;
	}

	mounted() {
		Canvas();
	}
}
