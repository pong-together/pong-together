import Component from '../../../core/Component.js';
import Start from './GameStart.js';

export default class extends Component {
	template() {
		return `
			<div class="display-container">
				<div class="game-count"></div>
			</div>
		`;
	}

	timer() {
		let seconds = 5;
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
