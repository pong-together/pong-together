import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import GameReady from './GameReady.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

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
		this.$state = {
			player1: '',
			player2: '',
			gameMode: window.localStorage.getItem('gameMode'),
			player1_result: '',
			player1_score: '',
			player2_result: '',
			player2_score: '',
			winner: '',
		}
	}

	template() {
		return `
			<div class="game-container">
				<div class="player1-container">
					<div class="player1-image"></div>
					<div class="player1-nickname">${this.$state.player1}</div>
					<div class="player1-gameresult">${this.$state.player1_result}</div>
					<div class="player1-score-info">score</div>
					<div class="player1-game-score">${this.$state.player1_score}</div>
				</div>
				<div class="game-display"></div>
				<div class="player2-container">
					<div class="player2-game-score">${this.$state.player2_score}</div>
					<div class="player2-score-info">score</div>
					<div class="player2-gameresult">${this.$state.player2_result}</div>
					<div class="player2-nickname">${this.$state.player2}</div>
					<div class="player2-image"></div>
				</div>
			</div>
		`;
	}

	setState(newState){
		this.$state = { ...this.$state, ...newState };
		// this.render();
	}

	connectGameSocket() {
		// console.log("!!");
		const gameSocket = new WebSocket(
			`${SOCKET_URL}/ws/games/?token=${localStorage.getItem('accessToken')}&type=${localStorage.getItem('gameMode')}&type_id=${localStorage.getItem('local-id')}`,
		)
		
		gameSocket.onopen = () => {
			this.addEvent('keypress', '.game-display', (e) => {
				if (e.key === 'w') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player1}`,
						button: "up",
					};

					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === 's'){
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player1}`,
						button: "down",
					};

					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === 'p') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player2}`,
						button: "up",
					};

					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === ';') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player2}`,
						button: "down",
					};
					gameSocket.send(JSON.stringify(message));
				}
			})
		}

		gameSocket.onclose = () => {
			console.log('gamesocket disconnect... Trying to reconnect...');
			return ;
			// setTimeout(() => this.connectGameSocket(), 1000);
		}

		gameSocket.onerror = function (e) {
			// console.log(e);
		}

		gameSocket.onmessage = (event) => {
			// console.log('!!' + event.data);
			const data = JSON.parse(event.data);
			if (data.type && data.type === 'start') {
				console.log("1");
				this.setState({ player1: data.player1 });
				this.setState({ player2: data.player2 });
			}
			else if (data.type && data.type === 'end') {
				console.log('2');
				this.setState ({winner: data.winner});
				if (data.is_normal === false)
					gameSocket.close();
			}
			else if (data.type && data.type === 'get_game_info') {
				//전역으로 공좌표 관리하기?
				console.log("x : " + data.ball_x + 'y : ' + data.ball_y + 'p1x: ' + data.player1_y + 'p2x: ' + data.player2_y);
				window.localStorage.setItem('ball_x', data.ball_x);
				window.localStorage.setItem('ball_y', data.ball_y);
				window.localStorage.setItem('player1_y', data.player1_y);
				window.localStorage.setItem('player2_y', data.player2_y);
				console.log('x: ' + window.localStorage.getItem('ball_x'));
			}
		}
	}

	mounted() {
		new GameReady(document.querySelector('.game-display'));
		this.connectGameSocket();
	}
}
