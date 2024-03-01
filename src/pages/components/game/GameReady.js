import Component from '../../../core/Component.js';
import { navigate } from '../../../router/utils/navigate.js';
import Start from './GameStart.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
			navigate('/login');
		}
	}

	template() {
		return `
			<div class="display-container">
				<div class="game-count">3</div>
			</div>
		`;
	}

	timer() {
		let seconds = 2;
		let time;
		const countdown = document.querySelector('.game-count');

		const updateTimer = () => {
			countdown.textContent = `${seconds}`;
		};

		function startTimer() {
			time = setInterval(() => {
				updateTimer();
				if (seconds === 0) {
					clearInterval(time);
					new Start(document.querySelector('.game-display'));
				} else {
					seconds--;
				}
			}, 1000);
		}
		startTimer();
	}

	mounted() {
		this.timer();
	}
}
