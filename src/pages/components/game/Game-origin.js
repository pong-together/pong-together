import Component from '../../../core/Component.js';
import { navigate } from '../../../router/utils/navigate.js';
import GameReady from './GameReady.js';

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

	mounted() {
		new GameReady(document.querySelector('.game-display'));
	}
}
