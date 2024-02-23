import Component from '../../core/Component.js';
import Router from '../router.js';
import Pages from '../pages.js';
import store from '../../store/index.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
			rate: 0,
		};
		this.$store = this.$props;
		//store.events.subscribe('intraIdChange', async () => {
		//	this.render();
		//});
		//store.events.subscribe('intraImgChange', async () => {
		//	this.render();
		//});
		//store.events.subscribe('intraWinCountChange', async () => {
		//	this.render();
		//});
		//store.events.subscribe('intraLoseCountChange', async () => {
		//	this.render();
		//});

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
						<div class="intra-nickname">${localStorage.getItem('intraId')}</div>
						<div class="record">${localStorage.getItem('winCount')}승 ${localStorage.getItem('loseCount')}패(${this.$state.rate}%)</div>
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

		this.changeModule();
		this.routerModule();
		//this.calcRate();

		if (localStorage.getItem('accessToken') && localStorage.getItem('twoFA')) {
			store.dispatch('changeLoginProgress', 'done');
		} else if (localStorage.getItem('accessToken')) {
			store.dispatch('changeLoginProgress', 'twoFA');
		}
	}
}
