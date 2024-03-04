import Component from '../../../core/Component.js';
import { navigate } from '../../../router/utils/navigate.js';
import language from '../../../utils/language.js';
import RemoteReady from './RemoteReady.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		}

		this.$state = this.$props;
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].searchText}</div>
			<img src="static/images/question-mark.png" id="question">
			<div id="counter"></div>
			<button class="match-button" id="search">${language.remote[this.$state.region].searchButton}</button>
		`;
	}

	setEvent() {
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (target.id === 'search') {
				this.stopCounter();
			}
		});
	}

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		function stopCounter() {
			clearInterval(count);
			updateCounter();
			navigate('/select');
		}
		this.stopCounter = stopCounter;

		const startCounter = () => {
			count = setInterval(() => {
				if (seconds === 4) {
					clearInterval(count);
					new RemoteReady(document.querySelector('.mainbox'), this.$state);
				}
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		};

		startCounter();
	}

	mounted() {
		this.counter();
	}
}
