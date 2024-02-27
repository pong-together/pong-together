import Component from '../../core/Component.js';
import Router from '../router.js';
import Pages from '../pages.js';
import store from '../../store/index.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
		};
		this.$store = this.$props;
	}

	template() {
		return `
		<div class="body-wrapper"></div>
		`;
	}

	changeModule() {
		if (window.location.hash === '#/login') {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
			<div class="login-wrapper" data-link>
				<div class="body-wrapper"></div>
			</div>`;
		} else {
			this.$target.innerHTML = '';
			this.$target.innerHTML = `
			<div class="back-wrapper" data-link>
			<div class="back-logo-wrapper"><img class="back-logo" src="../../static/images/logoBlue.png" alt=""/></div>
			<div class="body-wrapper"></div>
			<div class="footer-wrapper">
				<div class="chip-container">
				<div class="chip-top">
					<div class="yellow-box1"></div>
					<div class="yellow-box2"></div>
					<div class="yellow-box3"></div>
				</div>
				<div class="chip-middle">
					<div class="chip-logo"></div>
					<div class="intra-info">
						<div class="intra-nickname">${localStorage.getItem('intraId')}</div>
						<div class="record">${localStorage.getItem('winCount')}승 ${localStorage.getItem('loseCount')}패(${localStorage.getItem('rate')}%)</div>
					</div>
				</div>
				<div class="intra-picture">
					<div class="chip-picture"><img class="chip-image" src="${localStorage.getItem('intraImg')}"/></div>
				</div>
				<div class="chip-bottom">
					<div class="triangle"></div>
				</div>
			</div>

			<div class="chat-container">
				<div class="message-container">

					<div id="messages"><span id="message-time-stamp">24.02.23</span><span id="message">sooyang: 안녕하세요 </span></div>
					<div id="messages"><span id="message-time-stamp">24.02.23</span><span id="message">sooyang: 안녕하세요 </span></div>
					<div id="messages"><span id="message-time-stamp">24.02.23</span><span id="message">sooyang: 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트  </span></div>

				</div>
				<form action="" id="chat-form">
					<input id="m" autocomplete="off" /><button class="message-btn">전송</button>
				</form>
			</div>
			</div>
		</div>
			`;
		}
	}

	routerModule() {
		const $body = this.$target.querySelector('.body-wrapper');
		const pages = Pages($body, this.$store);
		const router = Router($body);
		router.addRoute('#/', pages.login);
		router.addRoute('#/login', pages.login);
		router.addRoute('#/select', pages.gameSelect);
		router.addRoute('#/local', pages.local);
		router.addRoute('#/tournament', pages.tournament);
		router.addRoute('#/remote', pages.remote);
		router.addRoute('#/game', pages.game);
		router.start();
	}

	calcRate() {
		this.$state.rate =
			store.state.winCount + store.state.loseCount !== 0
				? Math.round(
						(store.state.winCount /
							(store.state.winCount + store.state.loseCount)) *
							100,
					)
				: 0;
	}

	connectSocket() {
		const chatSocket = new WebSocket(
			`wss://localhost:443/ws/chat/?token=${localStorage.getItem('accessToken')}`,
		);

		chatSocket.onopen = () => {
			this.addEvent('click', '#message-btn', (e) => {
				e.preventDefault();
				var message = this.$taregt.querySelector('#m').value;
				if (message) {
					chatSocket.send({ message });
					console.log('Message sent: ' + message);
					this.$taregt.querySelector('#m').value = '';
				}
			});
		};

		chatSocket.onclose = function () {
			console.log('Connection closed, attempting to reconnect...');
			setTimeout(connectSocket, 1000);
		};

		chatSocket.onerror = function (e) {
			console.log(e);
		};

		chatSocket.onmessage = function (event) {
			//console.log(event);
			const data = JSON.parse(event.data);
			//console.log(event.data);
			if (data.type && data.type === 'chat_message') {
				displayMessage(data);
			} else if (data.type && data.type === 'ping') {
				console.log('pong');
				chatSocket.send(JSON.stringify({ type: 'pong' }));
			}
		};

		function displayMessage(data) {
			console.log(data);
			const messageContainer = this.$target.querySelector('.message-container');
			const messageElement = document.createElement('div');
			messageElement.id = 'messages';
			const messageTime = document.createElement('span');
			messageTime.id = 'message-time-stamp';
			const messageContent = document.createElement('span');
			messageContent.id = 'message';

			messageTime.textContent = `${data.timestamp}`;
			messageContent.textContent = `${data.intra_id}: ${data.message}`;
			messageElement.appendChild(messageTime);
			messageElement.appendChild(messageContent);
			messageContainer.appendChild(messageElement);
		}
	}

	async mounted() {
		console.log(store.state.loginProgress);
		//window.localStorage.removeItem('acessToken');
		window.addEventListener('hashchange', () => {
			this.changeModule();
			this.routerModule();
		});

		window.addEventListener('load', () => {
			this.changeModule();
			this.routerModule();
		});

		this.calcRate();
		this.connectSocket();

		if (localStorage.getItem('accessToken') && localStorage.getItem('twoFA')) {
			store.dispatch('changeLoginProgress', 'done');
		} else if (localStorage.getItem('accessToken')) {
			store.dispatch('changeLoginProgress', 'twoFA');
		}
	}
}
