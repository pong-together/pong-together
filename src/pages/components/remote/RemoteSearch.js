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
	}

	setEvent() {
		document.addEventListener('click', async (e) => {
			const target = e.target;
			if (target.id === 'search') {
				console.log('취소하기 버튼 동작 확인하는 로그');
				await this.stopCounter();
				// console.log('Socket close await 확인하는 로그');
				// await this.sleep();
				// console.log('sleep() 정상 작동 확인하는 로그 : Select');
				window.location.pathname = '/select';
			}
		});
		window.addEventListener('beforeunload', (e) => {
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				e.preventDefault();
				this.stopCounter();
				// const confirmMessage = '새로고침을 하시겠습니까?';
				// e.returnValue = confirmMessage;
				// return confirmMessage;
			}
		});
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

	async sleep() {
		const asleep = () => {
			return new Promise((resolve) => setTimeout(resolve, 5000));
		};
		const wait = async () => {
			console.log('sleep 시작');
			await asleep();
			console.log('sleep 끝');
		};
		await wait();
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
			} else {
				console.log('원격 소켓이 서버로부터 메시지를 수신했습니다.');
				this.$state.type = data.type;
				this.$state.typeID = data.id;
				this.$state.intraID = data.intra_id;
				this.$state.opponentIntraID = data.opponent;
				this.$state.opponentIntraPic = data.opponent_image;
				localStorage.setItem('remoteState', JSON.stringify(this.$state));
				await this.stopCounter();
				// console.log('Socket close await 확인하는 로그');
				// await this.sleep();
				// console.log('sleep() 정상 작동 확인하는 로그 : Ready');
				console.log(
					'remoteState 객체 내용 확인',
					localStorage.getItem('remoteState'),
				);
				new RemoteReady(document.querySelector('.mainbox'), this.$state);
			}
		};

		this.remoteSocket.onerror = () => {
			console.log('원격 소켓 에러');
			this.stopCounter();
		};
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

		const stopCounter = async () => {
			clearInterval(count);
			updateCounter();
			if (
				this.remoteSocket &&
				this.remoteSocket.readyState !== WebSocket.CLOSED
			) {
				await this.closeSocket();
				// console.log(
				// 	'원격 소켓이 정상적으로 닫히는지 확인하는 로그(stopCounter), readyState =', this.remoteSocket.readyState);
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

	mounted() {
		console.log('마운트가 한번만 되는지 확인하는 로그 : Search');
		this.counter();
		this.connectSocket();
	}
}
