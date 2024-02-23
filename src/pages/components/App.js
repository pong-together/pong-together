import Component from '../../core/Component.js';
import Router from '../router.js';
import Pages from '../pages.js';
import store from '../../store/index.js';
import http from '../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
			rate:
				store.state.winCount + store.state.loseCount !== 0
					? Math.round(
							(store.state.winCount /
								(store.state.winCount + store.state.loseCount)) *
								100,
						)
					: 0,
		};
		this.$store = this.$props;
		if (localStorage.getItem('language')) {
			store.dispatch('changeLanguage', localStorage.getItem('accessToken'));
		}
		if (localStorage.getItem('intraId')) {
			store.dispatch('changeIntraId', localStorage.getItem('intraId'));
		}
		if (localStorage.getItem('winCount')) {
			store.dispatch('changeWinCount', localStorage.getItem('winCount'));
		}
		if (localStorage.getItem('loseCount')) {
			store.dispatch('changeLoseCount', localStorage.getItem('loseCount'));
		}
		if (localStorage.getItem('intraImg')) {
			store.dispatch('changeIntraImg', localStorage.getItem('intraImg'));
		}
		store.events.subscribe('loginProgressChange', async () => {
			if (store.state.loginProgress === 'done') {
				const accessToken = 'Bearer ' + localStorage.getItem('accessToken');
				const data = await http.get('https://localhost:443/api/userinfo/id/', {
					Authorization: accessToken,
					'Content-Type': 'application/json',
				});
				localStorage.setItem('intraId', data.intraId);
				store.dispatch('changeIntraId', data.intraId);
				localStorage.setItem('winCount', data.win_count);
				store.dispatch('changeWinCount', data.win_count);
				localStorage.setItem('loseCount', data.lose_count);
				store.dispatch('changeLoseCount', data.lose_count);
				localStorage.setItem('intraImg', data.image);
				store.dispatch('changeIntraImg', data.image);
			}
			console.log(store.state.loginProgress);
		});
		//store.events.subscribe('intraIdChange', async () => this.render());
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
						<div class="intra-nickname">${store.state.intraId}</div>
						<div class="record">${store.state.winCount}승 ${store.state.loseCount}패(${this.$state.rate}%)</div>
					</div>
				</div>
				<div class="intra-picture">
					<div class="chip-picture"></div>
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
				<input id="m" autocomplete="off" /><button>전송</button>
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
		router.addRoute('#/login', pages.login);
		router.addRoute('#/select', pages.gameSelect);
		router.addRoute('#/local', pages.local);
		router.addRoute('#/tournament', pages.tournament);
		router.addRoute('#/remote', pages.remote);
		router.addRoute('#/game', pages.game);
		router.start();
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

		if (
			localStorage.getItem('accessToken') &&
			localStorage.getItem('twoFASuccess')
		) {
			store.dispatch('changeLoginProgress', 'done');
		} else if (localStorage.getItem('accessToken')) {
			store.dispatch('changeLoginProgress', 'twoFA');
		}

		if (store.state.loginProgress === 'done') {
		}
	}
}
