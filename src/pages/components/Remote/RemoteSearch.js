import Component from '../../../core/Component.js';
import Router from '../../router.js';
import language from '../../../utils/language.js';
import Found from './RemoteFound.js';

export default class extends Component {

	// constructor($target, $props) {
	// 	super($target, $props);
	// }

	setup() {
		// super.setup();
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

	counter() {
		let minutes = 0;
		let seconds = 0;
		let count;
		const counterElement = document.getElementById('counter');
		
		function updateCounter() {
			counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}

		function stopCounter() {
			clearInterval(count);
			updateCounter();
			
			const router = Router();
			router.navigate('#/select');
		}

		this.stopCounter = stopCounter;

		const startCounter = () => {
			count = setInterval(() => {
				// if (this.$state.remoteState === found) {
				// 	stopCounter();
				// }
				updateCounter();
				if (seconds === 5) {
					clearInterval(count);
					updateCounter();
					new Found(document.querySelector('.mainbox'), this.$state);
				}
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
			}, 1000);
		}

		startCounter();
	}

	// 비동기로 백엔드로부터 매칭됐음을 받아오는 처리
	/*
		

		getServer() {
			if (this.$state.remoteState === 'found')
				new Wait();
			const BASE_URL = '';
			const HEADERS = {
				'content-Type': 'application/json'
			}
			const result = () => http.get(BASE_URL, HEADERS);
		}
	*/

	mounted() {
		this.counter();
		// getServer();
		document.addEventListener('click', e => {
			const target = e.target;
			if (target.id === 'search') {
				this.stopCounter();
			}
		});
	}
}