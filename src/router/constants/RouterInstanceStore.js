import store from "../../store";
import { routes } from "./pages";

export default class RouterInstanceStore {
	constructor() {
			this.instances = {};
			this.key = [];
			window.localStorage.setItem('instance_key', JSON.stringify(this.key));
	}

	findMatchedRoute() {
		return routes.find(route => route.path.test(window.location.pathname));
	}

	getInstance(routeName, $container) {
		const storedArray = JSON.parse(window.localStorage.getItem('instance_key')) || [];
	
		if (!storedArray.includes(routeName)) {
			const route = this.findMatchedRoute(routeName);
			if (!route) {
				this.instances[routeName] = new NotFound($container);
			} else {
				this.instances[routeName] = new route.element($container);
				storedArray.push(routeName);
				window.localStorage.setItem('instance_key', JSON.stringify(storedArray));
			}
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

