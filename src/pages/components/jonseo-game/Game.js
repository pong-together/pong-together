import Component from '../../../core/Component.js';
import GameStart from './GameStart.js';

export default class extends Component {

	template() {
        return `
		<div class="game-container">
			<div class="player1-container">
				<div class="player1-image"></div>
				<div class="player1-nickname">player1</div>
				<div class="player1-gameresult">Win</div>
				<div class="player1-score-info">score</div>
				<div class="player1-game-score">0</div>
			</div>
			<div class="game-display"></div>
			<div class="player2-container">
				<div class="player2-game-score">0</div>
				<div class="player2-score-info">score</div>
				<div class="player2-gameresult">Lose</div>
				<div class="player2-nickname">player2</div>
				<div class="player2-image"></div>
			</div>
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
				if (seconds === 0) {
					clearInterval(time);
					updateTimer();
					new GameStart();
				} else {
					seconds--;
				}
				updateTimer();
			}, 1000);
		}

		startTimer();
	}

	mounted() {
		
	}

	mounted() {
		// getServer();
		const displayNode = document.querySelector('.game-display');
		const countNode = document.createElement('div');
		countNode.classList.add('game-count');
		displayNode.appendChild(countNode);
		countNode.textContent = '5';
		this.timer();
	}
}