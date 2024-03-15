import { routes } from "./pages";

export default class RouterInstanceStore {
	constructor() {
			this.instances = {};
	}

	findMatchedRoute() {
		return routes.find(route => route.path.test(window.location.pathname));
	}

	getInstance(routeName, $container) {
			if (!this.instances[routeName]) {
					const TargetPage = this.findMatchedRoute(routeName)?.element || NotFound;
					this.instances[routeName] = new TargetPage($container);
					return this.instances[routeName];
			}
			return this.instances[routeName];
	}

	destroyInstance(routeName) {
			if (this.instances[routeName] && typeof this.instances[routeName].destroy === 'function') {
					this.instances[routeName].destroy();
					this.instances[routeName] = null;
			}
	}

	setInstance(routeName, instance) {
		this.instances[routeName] = instance;
	}
};

