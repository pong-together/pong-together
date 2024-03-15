import { routes } from './constants/pages.js';
import NotFound from '../pages/components/NotFound.js';
import RouterInstanceStore from './constants/RouterInstanceStore.js';

// function Router($container) {
// 	this.$container = $container;
// 	let currentPage = undefined;

// 	const findMatchedRoute = () =>
// 		routes.find((route) => route.path.test(location.pathname));

// 	const instanceStore = new RouterInstanceStore();

// 	const route = () => {
// 		if (currentPage && typeof currentPage.destroy === 'function'){
// 			currentPage.destroy();
// 		}
// 		currentPage = null;
// 		const TargetPage = findMatchedRoute()?.element || NotFound;
// 		if (!instanceStore.getInstance(TargetPage)) {
// 			instanceStore.setInstance(TargetPage, new TargetPage(this.$container));
// 		}
// 		currentPage = instanceStore.getInstance(TargetPage);
// 		currentPage.init(this.$container);

// 		console.log('current page:', currentPage);
// 	};

// 	const init = () => {
// 		window.addEventListener('historychange', ({ detail }) => {
// 			const { to, isReplace } = detail;

// 			if (isReplace || to === location.pathname)
// 				history.replaceState(null, '', to);
// 			else history.pushState(null, '', to);

// 			route();
// 		});

// 		window.addEventListener('popstate', () => {
// 			route();
// 		});
// 	};

// 	init();
// 	route();
// }

// export default Router;



export default class Router {
	constructor($container) {
			this.$container = $container;
			this.currentPage = undefined;
			this.instanceStore = new RouterInstanceStore();
			this.init();
			this.route();
	}

	findMatchedRoute() {
		return routes.find(route => route.path.test(window.location.pathname));
	}

	route() {
			const matchedRoute = this.findMatchedRoute();
			const routeName = matchedRoute ? matchedRoute.element.name : 'NotFound';

			if (this.currentPage && typeof this.currentPage.destroy === 'function') {
					this.currentPage.destroy();
			}
			this.currentPage = null;

			const TargetPage = matchedRoute ? matchedRoute.element : NotFound;

			if (!this.instanceStore.getInstance(routeName)) {
					const newInstance = new TargetPage(this.$container);
					this.instanceStore.setInstance(routeName, newInstance);
			}

			this.currentPage = this.instanceStore.getInstance(routeName);
			if (typeof this.currentPage.render === 'function') {
					this.currentPage.render();
			}

			console.log('Current page:', this.currentPage);
	}

	init() {
			window.addEventListener('popstate', () => this.route());
			window.addEventListener('historychange', ({ detail }) => {
					const { to, isReplace } = detail;
					if (isReplace) {
							history.replaceState(null, '', to);
					} else {
							history.pushState(null, '', to);
					}
					this.route();
			});
	}
};
