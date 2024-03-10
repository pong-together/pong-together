import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import RemoteReady from './RemoteReady.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
	constructor($target, $props) {
		super($target, $props);
		this.remoteSocket;
		this.remo;
	}

	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		}

		this.intra = {
			opponentIntraID: 'undefined',
			opponentIntraPic: 'undefined',
		};
		this.$state = this.$props;
		this.setState(this.intra);
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].searchText}</div>
			<img src="static/images/question-mark.png" id="question">
			<div id="counter"></div>
			<button class="match-button" id="search">${language.remote[this.$state.region].searchButton}</button>
		`;
	}

	setState(newState) {
		this.$state = { ...this.$state, ...newState };
	}

	setEvent() {
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (target.id === 'search') {
				this.stopCounter();
			}
		});
	}

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		const stopCounter = () => {
			clearInterval(count);
			updateCounter();
			if (this.remoteSocket) {
				this.remoteSocket.close();
			}
			// window.location.pathname = '/select';
		};
		this.stopCounter = stopCounter;

		const nextLevel = () => {
			clearInterval(count);
			updateCounter();
			if (this.remoteSocket) {
				this.remoteSocket.close();
			}
			new RemoteReady(document.querySelector('.mainbox'), this.$state);
		};
		this.nextLevel = nextLevel;

		const startCounter = () => {
			count = setInterval(() => {
				if (seconds === 60) {
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

	connectSocket() {
		this.remoteSocket = new WebSocket(
			`${SOCKET_URL}/ws/remote/?token=${localStorage.getItem('accessToken')}&game_mode=${localStorage.getItem('gameLevel')}`,
		);

		this.remoteSocket.onopen = () => {
			console.log('this.remoteSocket connected');
			console.log(this.remoteSocket);
		};

		this.remoteSocket.onmessage = (e) => {
			console.log('received msg from server');
			const data = JSON.parse(e.data);
			this.$state.type = data.type;
			this.$state.opponentIntraID = data.opponent;
			console.log();
			this.$state.intraID = data.intra_id;
			this.$state.opponentIntraPic = data.opponent_image;
			this.$state.typeID = data.id;
			localStorage.setItem('remoteState', JSON.stringify(this.$state));
			this.nextLevel();
		};

		this.remoteSocket.onerror = () => {
			console.log('remoteSocker error');
			this.remoteSocket.close();
		};

		this.remoteSocket.onclose = () => {
			console.log('remoteSocker closed');
			localStorage.removeItem('mode');
		};
	}

	mounted() {
		this.counter();
		this.connectSocket();
	}
}
