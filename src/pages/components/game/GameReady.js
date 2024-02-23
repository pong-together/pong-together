import Component from '../../../core/Component.js';
import Canvas from './Canvas.js';

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
		}

		function startTimer() {
			time = setInterval(() => {
				updateTimer();
				if (seconds === 5) {
					clearInterval(time);
					new Canvas(document.querySelector('.display-container'));
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
