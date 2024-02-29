import Component from '../../../core/Component.js';
import { navigate } from '../../../router/utils/navigate.js';
import language from '../../../utils/language.js';

export default class extends Component {
	setup() {
		this.$state = this.$props;
		this.intra = {
			intraPicture: 'none',
			intraID: 'jonseo',
		};
		this.setState({ ...this.$state, ...this.intra });
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
			//const router = Router();
			navigate('/select');
		}

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 1) {
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
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
			navigate('/login');
		}
		this.timer();
	}
}
