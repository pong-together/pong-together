import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';

export default class extends Component {
	constructor($target, $props, remoteSocket) {
		super($target, $props, remoteSocket);
	}
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		}

		this.$state = this.$props;
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].readyText}</div>
			<img src="${this.$state.intraPicture}" id="picture">
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
			remoteSocket.close();
			window.location.pathname = '/game';
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
		this.timer();
	}
}
