import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import { navigate } from '../../../router/utils/navigate.js';
import language from '../../../utils/language.js';
import { displayCanceledMatchingModal } from '../../../utils/modal';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class Remote extends Component {
	constructor($target, $props) {
		super($target, $props);
		this.remoteSocket;
		// this.count;
		// this.time;
	}

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
			region: 'kr',
			opponentIntraID: 'undefined',
			opponentIntraPic: 'undefined',
		};

		if (localStorage.getItem('language')) {
			this.$state.region = localStorage.getItem('language');
		}
	}

	setEvent() {
		document.addEventListener('click', async (e) => {
			const target = e.target;
			if (target.id === 'search') {
				await this.stopCounter();
				navigate('/select');
			}
		});
	}

	template() {
		return `
			<div class="main-container">
				<div class="container">
					<div class="mainbox">
						<div class="top-text">${language.remote[this.$state.region].searchText}</div>
						<img src="static/images/question-mark.png" id="question">
						<div id="counter"></div>
						<button class="match-button" id="search">${language.remote[this.$state.region].searchButton}</button>
					</div>
				</div>
			</div>
		`;
	}

	templateReady() {
		return `
			<div class="top-text">${language.remote[this.$state.region].readyText}</div>
			<img src="${this.$state.opponentIntraPic}" id="picture">
			<button id="match-intra">${this.$state.opponentIntraID}(5)</button>
		`;
	}

	async sleep(ms) {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	async closeSocket() {
		return new Promise((resolve) => {
			this.remoteSocket.onclose = () => {
				console.log(
					'원격 소켓 닫힘, readyState =',
					this.remoteSocket.readyState,
				);
				resolve();
			};
			this.remoteSocket.close();
		});
	}

	remoteReady() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.templateReady();
		this.timer();
	}

	exclamationMark() {
		const counterElement = document.getElementById('counter');
		counterElement.parentNode.removeChild(counterElement);

		const imageElement = document.getElementById('question');
		imageElement.src = 'static/images/exclamation-mark.png';
		imageElement.id = 'exclamation';
	}

	connectSocket() {
		this.remoteSocket = new WebSocket(
			`${SOCKET_URL}/ws/remote/?token=${localStorage.getItem('accessToken')}&game_mode=${localStorage.getItem('gameLevel')}`,
		);

		this.remoteSocket.onopen = () => {
			console.log('원격 소켓이 서버에 연결되었습니다.');
		};

		this.remoteSocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			if (data.type && data.type === 'ping') {
				console.log('remote', e.data);
				this.remoteSocket.send(JSON.stringify({ type: 'pong' }));
				console.log('remote pong');
			} else if (data.type && data.type === 'find_opponent') {
				console.log('원격 소켓이 서버로부터 메시지를 수신했습니다.');
				this.$state.opponentIntraID = data.opponent;
				this.$state.opponentIntraPic = data.opponent_image;
				localStorage.setItem('remote-id', data.id);
				clearInterval(this.count);
				this.exclamationMark();
				await this.sleep(3000);
				this.remoteReady();
			} else if (data.type && data.type === 'send_disconnection') {
				console.log('상대방이 나갔습니다.');
				await displayCanceledMatchingModal(
					language.remote[this.$state.region].cancelMatch,
				);
				await this.stopTimer();
				navigate('/select');
			}
		};

		this.remoteSocket.onerror = () => {
			console.log('원격 소켓 에러');
			// this.stopInterval();
		};
	}

	// async stopInterval() {
	// 	if (this.count) {
	// 		clearInterval(this.count);
	// 	} else if (this.timer) {
	// 		clearInterval(this.timer);
	// 	}

	// 	if (
	// 		this.remoteSocket &&
	// 		this.remoteSocket.readyState !== WebSocket.CLOSED
	// 	) {
	// 		await this.closeSocket();
	// 	}
	// }

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		const stopCounter = async () => {
			clearInterval(count);
			updateCounter();
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
			}
		};
		this.stopCounter = stopCounter;

		const startCounter = () => {
			count = setInterval(() => {
				if (seconds === 59) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		};
		startCounter();
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.getElementById('match-intra');
		const bindUpdateTimer = updateTimer.bind(this);

		function updateTimer() {
			buttonElement.textContent = `${this.$state.opponentIntraID}(${seconds})`;
		}

		const stopTimer = async () => {
			clearInterval(time);
			bindUpdateTimer();
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
			}
		};
		this.stopTimer = stopTimer;

		function startTimer() {
			time = setInterval(async () => {
				if (seconds === 0) {
					this.remoteSocket.send(JSON.stringify({ type: 'match_success' }));
					await stopTimer();
					navigate('/game');
				} else {
					seconds--;
				}
				bindUpdateTimer();
			}, 1000);
		}
		this.startTimer = startTimer;
		this.startTimer();
	}

	mounted() {
		console.log('마운트가 한번만 되는지 확인하는 로그 : Remote');
		this.counter();
		this.connectSocket();
	}
}
