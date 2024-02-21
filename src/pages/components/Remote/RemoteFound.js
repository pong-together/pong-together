import Component from '../../../core/Component.js';
import Router from '../../router.js';
import Search from './RemoteSearch.js';
import Wait from './RemoteWait.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none'
		};
	}

	template() {
		return `
			<div class="top-text">참가자를 찾았습니다!</div>
			<img src="static/images/exclamation-mark.png" id="exclamation">
			<button class="match-button" id="found">준비하기(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.querySelector('.match-button');
		
		function updateTimer() {
			buttonElement.textContent = `준비하기(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			updateTimer();
			new Wait();
		}

		this.stopTimer = stopTimer;

		function startTimer() {
			time = setInterval(() => {
				if (seconds === 0) {
					clearInterval(time);
					updateTimer();
					new Search();
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

	render() {
		const mainboxElement = document.querySelector('.mainbox');
		mainboxElement.innerHTML = this.template();
		this.mounted();
		this.timer();
	}

	mounted() {
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