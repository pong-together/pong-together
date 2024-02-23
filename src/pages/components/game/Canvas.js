import Component from '../../../core/Component.js';

export default class extends Component {
	template() {
        return `
			<canvas id="canvas"></canvas>
		`;
    }

	setEvent() {

	}

	canvas() {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		let img_p1 = new Image();
		let img_p2 = new Image();
		let img_ball = new Image();

		img_p1.src = '../../../../static/images/player1_bar.png'
		img_p2.src = '../../../../static/images/player2_bar.png'
		img_ball.src = '../../../../static/images/ball.png'

		class bar {
			constructor(x, y, w, h, i) {
				this.x = x;
				this.y = y;
				this.width = w;
				this.height = h;
				this.image = i;
			}

			draw() {
				// ctx.fillStyle = 'black';
				// ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.drawImage(this.image, this.x, this.y);
			}
		}

		class sphere {
			constructor(x, y, w, h) {
				this.x = x;
				this.y = y;
				this.width = w;
				this.height = h;
			}

			draw() {
				// ctx.fillStyle = 'blue';
				// ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.drawImage(img_ball, this.x, this.y);
			}
		}

		let player1 = new bar(334, 625, 18, 62, img_p1);
		let player2 = new bar(927, 625, 18, 62, img_p2);
		let ball = new sphere(630, 640, 30, 30);

		// let player1 = new bar(414, 624, 18, 62, img_p1);
		// let player2 = new bar(1007, 624, 18, 62, img_p2);
		// let ball = new sphere(630, 640, 30, 30);
	
		function move(key) {
			switch(key) {
				case 'KeyW':
					if (player1.y > 436) {
						player1.y -= 7;
					}
					break;
				case 'KeyS':
					if (player1.y < 830) {
						player1.y += 7;
					}
					break;
				case 'KeyO':
					if (player2.y > 400) {
						player2.y -= 7;
					}
					break;
				case 'KeyL':
					if (player2.y < 830) {
						player2.y += 7;
					}
					break;
			}
		}

		document.addEventListener('keydown', e => {
			move(e.code);
		});

		function frame() {
			requestAnimationFrame(frame);
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			player1.draw();
			player2.draw();
			ball.draw();
		}

		frame();
	}

	mounted() {
		this.canvas();
	}

	// git 테스트 중입니다.
}
