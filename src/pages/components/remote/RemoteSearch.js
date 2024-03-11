import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import RemoteReady from './RemoteReady.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default class extends Component {
	constructor($target, $props) {
		super($target, $props);
		this.remoteSocket;
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
		console.log(this.$state, 'state 객체 내용 확인');
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
				console.log(
					'원격 소켓이 정상적으로 닫히는지 테스트하는 로그(취소하기 버튼 눌렀을 때)',
				);
			}
			window.location.pathname = '/select';
		};
		this.stopCounter = stopCounter;

		const nextLevel = () => {
			clearInterval(count);
			updateCounter();
			if (this.remoteSocket) {
				this.remoteSocket.close();
				console.log(
					'원격 소켓이 정상적으로 닫히는지 테스트하는 로그(매칭됐을 때)',
				);
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
			console.log('원격 소켓이 서버에 연결되었습니다.');
		};

		this.remoteSocket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (data.type && data.type === 'ping') {
				console.log(data.type);
				this.remoteSocket.send(JSON.stringify({ type: 'pong' }));
				console.log('pong');
			} else {
				console.log('원격 소켓이 서버로부터 메시지를 수신했습니다.');
				this.$state.type = data.type;
				this.$state.typeID = data.id;
				this.$state.intraID = data.intra_id;
				this.$state.opponentIntraID = data.opponent;
				this.$state.opponentIntraPic = data.opponent_image;
				localStorage.setItem('remoteState', JSON.stringify(this.$state));
				console.log(
					'서버로부터 ping을 제외하고 메시지를 한번만 받는지 테스트하는 로그',
				);
				this.nextLevel();
			}
		};

		this.remoteSocket.onerror = () => {
			console.log('원격 소켓 에러');
			this.remoteSocket.close();
		};

		this.remoteSocket.onclose = () => {
			console.log('원격 소켓 닫힘');
		};
	}

	mounted() {
		console.log('마운트가 한번만 되는지 확인하는 로그 : Search');
		this.counter();
		this.connectSocket();
	}
}
