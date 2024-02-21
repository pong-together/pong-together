import Component from '../../../core/Component.js';
import Router from '../../router.js';
import Found from './RemoteFound.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none'
		};
	}

	template() {
		return `
			<div class="top-text">참가자 찾는중...</div>
			<img src="static/images/question-mark.png" id="question">
			<div id="counter"></div>
			<button class="match-button" id="search">취소하기</button>
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

		function startCounter() {
			count = setInterval(() => {
				// if (this.$state.remoteState === found) {
				// 	stopCounter();
				// }
				if (seconds === 5) {
					clearInterval(count);
					updateCounter();
					new Found();
				}
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				} else {
					seconds++;
				}
				updateCounter();
			}, 1000);
		}

		startCounter();
	}

	// 비동기로 백엔드로부터 매칭됐음을 받아오는 처리
	/*
		getServer() {
			if (this.$state.remoteState === 'found')
				new Wait();
		}
	*/

	render() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.template();
		this.mounted();
		this.counter();
	}

	mounted() {
		// getServer();
		document.addEventListener('click', e => {
			const target = e.target;
			if (target.id === 'search') {
				this.stopCounter();
			}
		});
	}
}