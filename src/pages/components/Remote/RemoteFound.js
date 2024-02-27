import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import Search from './RemoteSearch.js';
import Wait from './RemoteWait.js';

export default class extends Component {

	setup() {
		this.$state = this.$props;
	}

	template() {
		return `
			<div class="top-text">${language.remote[this.$state.region].foundText}</div>
			<img src="static/images/exclamation-mark.png" id="exclamation">
			<button class="match-button" id="found">${language.remote[this.$state.region].foundButton}(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.querySelector('.match-button');
		
		const updateTimer = () => {
			buttonElement.textContent = `${language.remote[this.$state.region].foundButton}(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			updateTimer();
			new Wait(document.querySelector('.mainbox'), this.$state);
		}

		this.stopTimer = stopTimer;

		const startTimer = () => {
			time = setInterval(() => {
				if (seconds === 0) {
					clearInterval(time);
					updateTimer();
					new Search(document.querySelector('.mainbox'), this.$state);
				} else {
					seconds--;
				}
				updateTimer();
			}, 1000);
		}

		startTimer();
	}

	// 비동기로 백엔드로부터 매칭됐음을 받아오는 처리
	/*
		getServer() {
			if (this.$state.remoteState === 'wait')
				new Wait();
		}
	*/

	mounted() {
		this.timer();
		// getServer();
		document.addEventListener('click', e => {
			const target = e.target;
			if (target.id === 'found') {
				// 서버로 준비 상태 보내기
				this.stopTimer();
			}
		});
	}
}