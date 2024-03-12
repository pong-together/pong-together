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
			player1_score: 0,
			player2_result: '',
			player2_score: 0,
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
			this.addEvent('keypress', (e) => {
				if (e.key === 'w') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player1}`,
						button: "up",
					};

					console.log('w');
					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === 's'){
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player1}`,
						button: "down",
					};

					console.log('s');
					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === 'p') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player2}`,
						button: "up",
					};

					console.log('s');
					gameSocket.send(JSON.stringify(message));
				}
				else if (e.key === ';') {
					const message = {
						type: `${localStorage.getItem('gameMode')}`,
						send_player: `${this.$state.player2}`,
						button: "down",
					};
					console.log('s');
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
			const data = JSON.parse(event.data);
			if (data.type && data.type === 'start') {
				this.setState({ player1: data.player1_name });
				this.setState({ player2: data.player2_name });
				console.log(data.player1_name, data.player2_name);
				this.$target.innerHTML = this.template();
			}
			else if (data.type && data.type === 'end') {
				this.setState ({winner: data.winner});
				this.$target.innerHTML = this.template();
				if (data.is_normal === false)
					gameSocket.close();
			}
			else if (data.type && data.type === 'score') {
				this.setState ({player1_score: data.player1_score});
				this.setState ({player2_score: data.player2_score});
				this.$target.innerHTML = this.template();
			}
			else if (data.type && data.type === 'get_game_info') {
				//전역으로 공좌표 관리하기?
				window.localStorage.setItem('ball_x', data.ball_x);
				window.localStorage.setItem('ball_y', data.ball_y);
				window.localStorage.setItem('player1_y', data.player1_y);
				window.localStorage.setItem('player2_y', data.player2_y);
			}
		}
	}

	mounted() {
		new GameReady(document.querySelector('.game-display'));
		this.connectGameSocket();
	}
}
