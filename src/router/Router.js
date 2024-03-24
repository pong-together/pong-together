import { routes } from './constants/pages.js';
import NotFound from '../pages/components/NotFound.js';

export default class Router {
	constructor($container) {
			this.$container = $container;
			this.currentPage = undefined;
			this.init();
			this.route();
	}

	findMatchedRoute() {
		return routes.find(route => route.path.test(window.location.pathname));
	}

	route() {
		const matchedRoute = this.findMatchedRoute();
		this.currentPage = null;

		const TargetPage = matchedRoute ? matchedRoute.element : NotFound;
		this.currentPage = TargetPage.getInstance(this.$container)
		this.currentPage.init(this.$container);
	}

	init() {
    window.addEventListener('popstate', () => this.route());
    window.addEventListener('historychange', ({ detail }) => {
        const { to, isReplace } = detail;
        if (location.pathname === to) {
            history.replaceState(null, '', to);
        } else {
            history.pushState(null, '', to);
        }
        this.route(); // isReplace 인자 제거
    });
	}
};
