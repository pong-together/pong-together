import Component from '../../../core/Component.js';
import Router from '../../router.js';
import language from '../../../utils/language.js';

export default class extends Component {

	constructor($target, $props) {
		super($target, $props);
	}

	setup() {
		super.setup();
		intra = {
			intraPicture: 'none', // API
			intraID: 'jonseo' // API
		};
		this.$state = this.$props;
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].readyText}</div>
			<img src="static/images/intraPicture.png" id="picture">
			<button id="match-intra">${this.$state.intraID}(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.getElementById('match-intra');
		const bindUpdateTimer = updateTimer.bind(this);
		
		function updateTimer() {
			buttonElement.textContent = `${this.$state.intraID}(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			bindUpdateTimer();
			const router = Router();
			router.navigate('#/select');
		}

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 0) {
					stopTimer();
				} else {
					seconds--;
				}
				bindUpdateTimer();
			}, 1000);
		}

		startTimer();
	}

	mounted() {
		setState(intra);
		this.timer();
	}
}