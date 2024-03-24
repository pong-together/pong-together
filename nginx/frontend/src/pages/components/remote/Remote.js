import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import { navigate } from '../../../router/utils/navigate.js';
import language from '../../../utils/language.js';
import { displayCanceledMatchingModal } from '../../../utils/modal';
import store from '../../../store/index.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class Remote extends Component {
	constructor($target, $props) {
		super($target, $props);
		this.remoteSocket;
		this.count;
		this.time;
	}

	static instance = null;

	static getInstance($container) {
		if (!Remote.instance) {
			Remote.instance = new Remote($container);
		}
		return Remote.instance;
	}

	async checkAccess() {
		if (store.state.checking === 'off') {
			store.state.checking = 'on';
			await http.checkToken();
			store.state.checking = 'off';
		}
	}

	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		} else {
			this.checkAccess();
		}

		this.$state = {
			region: 'kr',
			opponentIntraID: 'undefined',
			opponentIntraPic: 'undefined',
			opponentWin: '0',
			opponentLose: '0',
		};

		if (localStorage.getItem('language')) {
			this.$state.region = localStorage.getItem('language');
		}
	}

	setEvent() {
		const cancelEvent = async (e) => {
			const target = e.target;
			if (target.id === 'search') {
				await this.stopCounter();
				document.removeEventListener('click', cancelEvent);
				window.removeEventListener('popstate', popEvent);
				window.removeEventListener('beforeunload', unloadEvent);
				navigate('/select');
			}
		};
		document.addEventListener('click', cancelEvent);

		const popEvent = (e) => {
			this.stopInterval();
			localStorage.removeItem('remote-id');
			document.removeEventListener('click', cancelEvent);
			window.removeEventListener('popstate', popEvent);
			window.removeEventListener('beforeunload', unloadEvent);
		};
		window.addEventListener('popstate', popEvent);

		const unloadEvent = (e) => {
			this.stopInterval();
			localStorage.removeItem('remote-id');
			document.removeEventListener('click', cancelEvent);
			window.removeEventListener('popstate', popEvent);
			window.removeEventListener('beforeunload', unloadEvent);
		}
		window.addEventListener('beforeunload', unloadEvent);
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
			<div class="match-record">${this.$state.opponentWin}${language.remote[this.$state.region].winWord}\
				${this.$state.opponentLose}${language.remote[this.$state.region].loseWord}</div>
			<div id="match-intra">${this.$state.opponentIntraID}(5)</div>
<<<<<<< HEAD
		`;
	}

	templateProgress() {
		return `
			<div class="progress progress-custom">
				<div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width:200px;height:60px">
					<span>100%</span>
				</div>
			</div>
=======
>>>>>>> main
		`;
	}

	templateProgress() {
		return `
			<div class="progress progress-custom">
				<div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" style="width:200px;height:60px">
					<span>100%</span>
				</div>
			</div>
		`;
	}

	async sleep(ms) {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	async closeSocket() {
		return new Promise((resolve) => {
			this.remoteSocket.onclose = () => {
				resolve();
			};
			this.remoteSocket.close();
		});
	}

	async stopInterval() {
		if (this.count) {
			clearInterval(this.count);
		}
		if (this.time) {
			clearInterval(this.time);
		}
		if (
			this.remoteSocket &&
			this.remoteSocket.readyState !== WebSocket.CLOSED
		) {
			await this.closeSocket();
		}
	}

	remoteReady() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.templateReady();
		this.timer();
	}

	exclamationMark() {
		const mainboxElement = document.querySelector('.mainbox');
		const counterElement = document.getElementById('counter');
		const cancelElement = document.getElementById('search');
		counterElement.parentNode.removeChild(counterElement);
		cancelElement.parentNode.removeChild(cancelElement);

		mainboxElement.innerHTML += this.templateProgress();

		const imageElement = document.getElementById('question');
		imageElement.src = 'static/images/exclamation-mark.png';
		imageElement.id = 'exclamation';
	}

	async connectSocket() {
		this.remoteSocket = new WebSocket(
			`${SOCKET_URL}/ws/remote/?token=${localStorage.getItem('accessToken')}&game_mode=${localStorage.getItem('gameLevel')}`,
		);

		this.remoteSocket.onopen = () => {};

		this.remoteSocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			if (data.type && data.type === 'ping') {
				this.remoteSocket.send(JSON.stringify({ type: 'pong' }));
			} else if (data.type && data.type === 'find_opponent') {
				this.$state.opponentIntraID = data?.opponent;
				this.$state.opponentIntraPic = data?.opponent_image;
				this.$state.opponentWin = data?.opponent_win_count;
				this.$state.opponentLose = data?.opponent_lose_count;
				localStorage.setItem('remote-id', data?.id);
				clearInterval(this.count);
				this.exclamationMark();
				await this.sleep(3000);
				if (
					this.remoteSocket &&
					this.remoteSocket.readyState !== WebSocket.CLOSED
				) {
					this.remoteReady();
				}
			} else if (data.type && data.type === 'send_disconnection') {
				localStorage.removeItem('remote-id');
				await this.stopInterval();
				await displayCanceledMatchingModal(
					language.remote[this.$state.region].cancelMatch,
					document.querySelector('.mainbox'),
				);
				navigate('/select');
			}
		};

		this.remoteSocket.onerror = () => {
			this.stopInterval();
		};
	}

	counter() {
		let minutes = 0;
		let seconds = 0;
		const counterElement = document.getElementById('counter');
		counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		const stopCounter = async () => {
			clearInterval(this.count);
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
			}
		};
		this.stopCounter = stopCounter;

		const startCounter = () => {
			this.count = setInterval(() => {
				if (seconds === 59) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		};
		this.startCounter = startCounter;
		this.startCounter();
	}

	timer() {
		let seconds = 5;
		const buttonElement = document.getElementById('match-intra');
		const bindUpdateTimer = updateTimer.bind(this);

		function updateTimer() {
			buttonElement.textContent = `${this.$state.opponentIntraID}(${seconds})`;
		}

		const stopTimer = async () => {
			clearInterval(this.time);
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
			}
		};
		this.stopTimer = stopTimer;

		function startTimer() {
			this.time = setInterval(async () => {
				if (seconds === 1) {
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

	async mounted() {
		this.counter();
		await this.connectSocket();
	}
}
