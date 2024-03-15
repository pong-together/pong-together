import { routes } from '../router/constants/pages.js';
import NotFound from '../pages/components/NotFound.js';

function Router($container) {
	this.$container = $container;
	let currentPage = undefined;

	const findMatchedRoute = () =>
		routes.find((route) => route.path.test(location.pathname));

	const route = () => {
		let previousPage = currentPage;
		currentPage = null;
		const TargetPage = findMatchedRoute()?.element || NotFound;
		currentPage = TargetPage.getInstance(this.$container);
		console.log('current page:',currentPage);
		if (previousPage && typeof previousPage.destroy === 'function'){
			previousPage.destroy();
		}
		previousPage = null;
	};

	const init = () => {
		window.addEventListener('historychange', ({ detail }) => {
			const { to, isReplace } = detail;

			if (isReplace || to === location.pathname)
				history.replaceState(null, '', to);
			else history.pushState(null, '', to);

			route();
		});

		window.addEventListener('popstate', () => {
			route();
		});
	};

	init();
	route();
}

export default Router;
