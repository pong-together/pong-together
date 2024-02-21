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
						<div class="intra-nickname">jisulee</div>
						<div class="record">1승 1패(50%)</div>
					</div>
				</div>
				<div class="intra-picture">
					<div class="chip-picture"></div>
				</div>
				<div class="chip-bottom">
					<div class="triangle"></div>
				</div>
			</div>
				<div class="footer-chat"></div>
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

	mounted() {
		window.addEventListener('hashchange', () => {
			console.log('1');
			this.changeModule();
			this.routerModule();
		});

		window.addEventListener('load', () => {
			console.log('2');
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
		//this.routerModule();
		//console.log(this.$store);
	}
}
