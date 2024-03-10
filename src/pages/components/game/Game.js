import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import GameReady from './GameReady.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		} else {
			http.checkToken();
		}
		// this.$state = {
		// 	player1: '',
		// 	player2: '',
		// 	gameMode: window.localStorage.getItem('gameMode'),
		// 	player1_result: '',
		// 	player1_score: '',
		// 	player2_result: '',
		// 	player2_score: '',
		// 	winner: '',
		// }
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

	// connectGameSocket() {
	// 	const gameSocket = new WebSocket(
	// 		`${SOCKET_URL}/ws/games/?token=${localStorage.getItem('accessToken')}&type=${localStorage.getItem('gameMode')}&type_id=${localStorage.getItem('local-id')}`,
	// 	)
		
	// 	gameSocket.onopen = () => {
	// 		this.addEvent('keypress', '.game-display', (e) => {
	// 			if (e.key === 'w') {
	// 				const message = {
	// 					type: `${localStorage.getItem('gameMode')}`,
	// 					send_player: `${this.$state.player1}`,
	// 					button: "up",
	// 				};

	// 				gameSocket.send(JSON.stringify(message));
	// 			}
	// 			else if (e.key === 's'){
	// 				const message = {
	// 					type: `${localStorage.getItem('gameMode')}`,
	// 					send_player: `${this.$state.player1}`,
	// 					button: "down",
	// 				};

	// 				gameSocket.send(JSON.stringify(message));
	// 			}
	// 			else if (e.key === 'p') {
	// 				const message = {
	// 					type: `${localStorage.getItem('gameMode')}`,
	// 					send_player: `${this.$state.player2}`,
	// 					button: "up",
	// 				};

	// 				gameSocket.send(JSON.stringify(message));
	// 			}
	// 			else if (e.key === ';') {
	// 				const message = {
	// 					type: `${localStorage.getItem('gameMode')}`,
	// 					send_player: `${this.$state.player2}`,
	// 					button: "down",
	// 				};
	// 				gameSocket.send(JSON.stringify(message));
	// 			}
	// 		})
	// 	}

	// 	gameSocket.onclose = () => {
	// 		console.log('gamesocket disconnect... Trying to reconnect...');
	// 		setTimeout(() => this.connectGameSocket(), 1000);
	// 	}

	// 	gameSocket.onerror = function (e) {
	// 		// console.log(e);
	// 	}

	// 	gameSocket.onmessage = (event) => {
	// 		console.log(event.data);
	// 		const data = JSON.parse(event.data);
	// 		if (data.type && data.type === 'start') {
	// 			this.setState({ player1: data.player1 });
	// 			this.setState({ player2: data.player2 });
	// 		}
	// 		else if (data.type && data.type === 'end') {
	// 			this.setState ({winner: data.winner});
	// 			if (data.is_normal === false)
	// 				gameSocket.close();
	// 		}
	// 		else if (data.type && data.type === 'get_game_info') {
	// 			//전역으로 공좌표 관리하기?
	// 			store.dispatch('ball_xChange', data.ball_x);
	// 			console.log('ball_x = ' + store.state.ball_x);
	// 			store.dispatch('ball_yChange', data.ball_y);
	// 			store.dispatch('player1_yChange', data.player1_y);
	// 			store.dispatch('player2_yChange', data.player2_y);
	// 		}
	// 	}
	// }

	mounted() {
		new GameReady(document.querySelector('.game-display'));
		// this.connectGameSocket();
	}
}
