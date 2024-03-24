export default class {
	$target;
	$props;
	$state;
	$store;

	constructor($target, $props) {
		this.$target = $target;
		this.$props = $props;
	}

	init($target) {
		this.$target = $target;
		this.setup();
		this.setEvent();
		this.render();
	}

	setup() {}

	mounted() {}

	template() {
		return ``;
	}

	render() {
		this.$target.innerHTML = this.template();
		this.mounted();
	}

	setEvent() {}

	setState(newState) {
		this.$state = { ...this.$state, ...newState };
		this.render();
	}

	addEvent(eventType, seletor, callback) {
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(seletor)) return false;
			callback(event);
		});
	}
}
