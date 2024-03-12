export default function Canvas() {
	const displayElement = document.querySelector('.game-display');
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = displayElement.clientWidth;
	canvas.height = displayElement.clientHeight;

	const BASEWIDTH = 637;
	const BASEHEIGHT = 446;

	let img_p1 = new Image();
	let img_p2 = new Image();
	let img_ball = new Image();

	img_p1.src = '../../../../static/images/player1_bar.png';
	img_p2.src = '../../../../static/images/player2_bar.png';
	img_ball.src = '../../../../static/images/ball2.png';

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

		player1.y = window.localStorage.getItem('player1_y');
		player2.y = window.localStorage.getItem('player2_y');
		ball.x = window.localStorage.getItem('ball_x');
		ball.y = window.localStorage.getItem('ball_y');

		// move();
		player1.draw();
		player2.draw();
		ball.draw();
	}

	frame();
}
