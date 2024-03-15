export default class RouterInstanceStore {
	constructor() {
			this.instances = {};
	}

	getInstance(routeName, $container) {
			if (!this.instances[routeName]) {
					const TargetPage = findMatchedRoute(routeName)?.element || NotFound;
					this.instances[routeName] = TargetPage.getInstance($container);
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

