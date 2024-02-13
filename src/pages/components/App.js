import Component from '../../core/Component.js';
import Router from '../router.js';
import Pages from '../pages.js';

export default class extends Component {
	template() {
		console.log('test template');
		if (window.location.hash === '#/login') {
			return `
			<div class="login-wrapper" data-link>
			<div class="login-body-wrapper"></div>
			</div>
			`;
		}
		return `
		<div class="back-wrapper" data-link>
			<div class="back-logo-wrapper"><img class="back-logo" src="" alt=""/></div>
			<div class="body-wrapper"></div>
			<div class="footer-wrapper">
				<div class="footer-profile"></div>
				<div class="footer-chat"></div>
			</div>
		</div>
		`;
	}

	mounted() {
		const $body = this.$target.querySelector('.body-wrapper');
		const pages = Pages($body);
		const router = new Router($body);
		router.addRoute('#/login', pages.login);
		router.addRoute('#/select', pages.gameSelect);
		router.addRoute('#/local', pages.local);
		router.addRoute('#/tournament', pages.tournament);
		router.addRoute('#/remote', pages.remote);
		router.addRoute('#/game', pages.game);
		router.start();
	}
}
