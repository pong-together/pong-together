export default function Canvas() {
	const displayElement = document.querySelector('.game-display');
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = displayElement.clientWidth;
	canvas.height = displayElement.clientHeight;

	/*
		맥북 13인치 1440 x 900
		const baseWidth = 1440;
		const baseHeight = 900;
	*/

	// 클러스터 아이맥 27인치 5120 x 2880
	const baseWidth = 5120;
	const baseHeight = 2880;

	let img_p1 = new Image();
	let img_p2 = new Image();
	let img_ball = new Image();

	img_p1.src = '../../../../static/images/player1_bar.png';
	img_p2.src = '../../../../static/images/player2_bar.png';
	img_ball.src = '../../../../static/images/ball2.png';

	class bar {
		constructor(x, y, w, h, i) {
			this.baseX = x;
			this.baseY = y;
			this.width = w;
			this.height = h;
			this.image = i;
			this.x = this.baseX * (canvas.width / baseWidth);
			this.y = this.baseY * (canvas.height / baseHeight);
		}

		draw() {
			// ctx.fillStyle = 'black';
			// ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, this.x, this.y);
		}

		reCoordinate() {
			this.x = this.baseX * (canvas.width / baseWidth);
			// this.y = this.baseY * (canvas.height / baseHeight);
		}
	}

	class sphere {
		constructor(x, y, w, h) {
			this.baseX = x;
			this.baseY = y;
			this.width = w;
			this.height = h;
			this.x = this.baseX * (canvas.width / baseWidth);
			this.y = this.baseY * (canvas.height / baseHeight);
		}

		draw() {
			// ctx.fillStyle = 'blue';
			// ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.drawImage(img_ball, this.x, this.y);
		}

		reCoordinate() {
			this.x = this.baseX * (canvas.width / baseWidth);
			// this.y = this.baseY * (canvas.height / baseHeight);
		}
	}

	/*
		맥북 13인치 1440 x 900
		let player1 = new bar(414 / baseWidth, 350 / baseHeight, 18, 62, img_p1);
		let player2 = new bar(1007 / baseWidth, 350 / baseHeight, 18, 62, img_p2);
		let ball = new sphere(710 / baseWidth, 370 / baseHeight, 30, 30);
	*/

	/*
		클러스터 아이맥 27인치 5120 x 2880
		let player1 = new bar(600 / baseWidth, 625 / baseHeight, 18, 62, img_p1);
		let player2 = new bar(927 / baseWidth, 625 / baseHeight, 18, 62, img_p2);
		let ball = new sphere(630 / baseWidth, 640 / baseHeight, 30, 30);
	*/

	let player1 = new bar(107, 1200, 18, 62, img_p1);
	let player2 = new bar(4867, 1200, 18, 62, img_p2);
	let ball = new sphere(2475, 1350, 30, 30);

	const key = {
		KeyW: false,
		KeyS: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	function move() {
		let speed = 3;
		if (key['KeyW'] && player1.y > 28) {
			if ((player1.y -= speed) <= 28) {
				player1.y = 28;
			}
		}
		if (key['KeyS'] && player1.y < 355) {
			if ((player1.y += speed) >= 355) {
				player1.y = 355;
			}
		}
		if (key['ArrowUp'] && player2.y > 28) {
			if ((player2.y -= speed) <= 28) {
				player2.y = 28;
			}
		}
		if (key['ArrowDown'] && player2.y < 355) {
			if ((player2.y += speed) >= 355) {
				player2.y = 355;
			}
		}
	}

	document.addEventListener('keydown', (e) => {
		key[e.code] = true;
	});

	document.addEventListener('keyup', (e) => {
		key[e.code] = false;
	});

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

		move();
		player1.draw();
		player2.draw();
		ball.draw();
	}

	frame();
}
