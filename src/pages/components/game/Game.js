import Component from '../../../core/Component.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
		} else {
			http.checkToken();
		}
	}

	template() {
		return `
			<div class="game-container">
				<div class="player1-container">
					<div class="player1-image"></div>
					<div class="player1-nickname">player1</div>
					<div class="player1-gameresult">Win</div>
					<div class="player1-score-info">score</div>
					<div class="player1-game-score">0</div>
				</div>
				<div class="game-display">
					<div class="display-container">
						<div class="game-count">3</div>
					</div>
				</div>
				<div class="player2-container">
					<div class="player2-game-score">0</div>
					<div class="player2-score-info">score</div>
					<div class="player2-gameresult">Lose</div>
					<div class="player2-nickname">player2</div>
					<div class="player2-image"></div>
				</div>
			</div>
		`;
	}

	templateStart() {
		return `
			<canvas id="canvas"></canvas>
		`;
	}

	templateEnd() {
		return `
			<div class="game-end"></div>
		`;
	}

	gameStart() {
		const displayElement = document.querySelector('.game-display');
		displayElement.innerHTML = this.templateStart();
		this.canvas();
	}

	timer() {
		let seconds = 2;
		let time;
		const countdown = document.querySelector('.game-count');

		const updateTimer = () => {
			countdown.textContent = `${seconds}`;
		};

		const startTimer = () => {
			time = setInterval(() => {
				updateTimer();
				if (seconds === 0) {
					clearInterval(time);
					this.gameStart();
				} else {
					seconds--;
				}
			}, 1000);
		};
		startTimer();
	}

	canvas() {
		class Bar {
			constructor(x, y, w, h, i) {
				this.baseX = x;
				this.baseY = y;
				this.width = w;
				this.height = h;
				this.image = i;
				this.x = this.baseX * (canvas.width / BASEWIDTH);
				this.y = this.baseY * (canvas.height / BASEHEIGHT);
			}
			draw() {
				ctx.drawImage(this.image, this.x, this.y);
			}
			reCoordinate() {
				this.x = this.baseX * (canvas.width / BASEWIDTH);
			}
		}

		class Sphere {
			constructor(x, y, w, h) {
				this.baseX = x;
				this.baseY = y;
				this.width = w;
				this.height = h;
				this.x = this.baseX * (canvas.width / BASEWIDTH);
				this.y = this.baseY * (canvas.height / BASEHEIGHT);
			}
			draw() {
				ctx.drawImage(img_ball, this.x, this.y);
			}
			reCoordinate() {
				this.x = this.baseX * (canvas.width / BASEWIDTH);
			}
		}

		const displayElement = document.querySelector('.game-display');
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const BASEWIDTH = 637;
		const BASEHEIGHT = 446;
		canvas.width = displayElement.clientWidth;
		canvas.height = displayElement.clientHeight;

		let img_p1 = new Image();
		let img_p2 = new Image();
		let img_ball = new Image();
		img_p1.src = '../../../../static/images/player1_bar.png';
		img_p2.src = '../../../../static/images/player2_bar.png';
		img_ball.src = '../../../../static/images/ball2.png';

		let player1 = new Bar(10, 192, 19, 63, img_p1);
		let player2 = new Bar(608, 192, 19, 63, img_p2);
		let ball = new Sphere(309, 213, 20, 20);

		window.addEventListener('resize', (e) => {
			canvas.width = displayElement.clientWidth;
			canvas.height = displayElement.clientHeight;
			player1.reCoordinate();
			player2.reCoordinate();
			ball.reCoordinate();
		});

		function frame() {
			requestAnimationFrame(frame);
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// player1.y = window.localStorage.getItem('player1_y');
			// player2.y = window.localStorage.getItem('player2_y');
			// ball.x = window.localStorage.getItem('ball_x');
			// ball.y = window.localStorage.getItem('ball_y');

			player1.draw();
			player2.draw();
			ball.draw();
		}
		frame();
	}

	mounted() {
		this.timer();
	}
}
