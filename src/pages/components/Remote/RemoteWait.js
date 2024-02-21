import Component from '../../../core/Component.js';
import Router from '../../router.js';
import Search from './RemoteSearch.js';
import Ready from './RemoteReady.js';

export default class extends Component {

	setup() {
		this.$state = {
			remoteState: 'none'
		};
	}

	template() {
		return `
			<div class="top-text">상대방을 기다리는 중입니다.</div>
			<img src="static/images/exclamation-mark.png" id="exclamation">
			<button id="match-wait">준비하기(5)</button>
		`;
	}

	timer() {
		let seconds = 5;
		let time;
		const buttonElement = document.getElementById('match-wait');
		
		function updateTimer() {
			buttonElement.textContent = `준비하기(${seconds})`;
		}

		function stopTimer() {
			clearInterval(time);
			updateTimer();
			new Ready();
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
			if (this.$state.remoteState === 'ready')
				new Ready();
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
			if (target.id === 'match-wait') {
				// 서버로 준비 상태 보내기
				this.stopTimer();
			}
		});
	}
}