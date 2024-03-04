export default function Canvas() {
	const displayElement = document.querySelector('.game-display');
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = displayElement.clientWidth;
	canvas.height = displayElement.clientHeight;

	/*
		맥북 13인치 1440 x 900
		const BASEWIDTH = 1440;
		const BASEHEIGHT = 900;
	*/

	// 클러스터 아이맥 27인치 5120 x 2880
	// const BASEWIDTH = 5120;
	// const BASEHEIGHT = 2880;

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
			// ctx.fillStyle = 'black';
			// ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, this.x, this.y);
		}

		reCoordinate() {
			this.x = this.baseX * (canvas.width / BASEWIDTH);
			// this.y = this.baseY * (canvas.height / BASEHEIGHT);
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
			// ctx.fillStyle = 'blue';
			// ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.drawImage(img_ball, this.x, this.y);
		}

		reCoordinate() {
			this.x = this.baseX * (canvas.width / BASEWIDTH);
			// this.y = this.baseY * (canvas.height / BASEHEIGHT);
		}
	}

	/*
		맥북 13인치 1440 x 900
		let player1 = new Bar(414 / BASEWIDTH, 350 / BASEHEIGHT, 18, 62, img_p1);
		let player2 = new Bar(1007 / BASEWIDTH, 350 / BASEHEIGHT, 18, 62, img_p2);
		let ball = new Sphere(710 / BASEWIDTH, 370 / BASEHEIGHT, 30, 30);
	*/

	/*
		클러스터 아이맥 27인치 5120 x 2880
		let player1 = new Bar(600 / BASEWIDTH, 625 / BASEHEIGHT, 18, 62, img_p1);
		let player2 = new Bar(927 / BASEWIDTH, 625 / BASEHEIGHT, 18, 62, img_p2);
		let ball = new Sphere(630 / BASEWIDTH, 640 / BASEHEIGHT, 30, 30);
	*/

	// let player1 = new Bar(107, 1200, 18, 62, img_p1);
	// let player2 = new Bar(4867, 1200, 18, 62, img_p2);
	// let ball = new Sphere(2475, 1350, 30, 30);

	let player1 = new Bar(13, 192, 18, 62, img_p1);
	let player2 = new Bar(606, 192, 18, 62, img_p2);
	let ball = new Sphere(313, 215, 20, 20);

	const key = {
		KeyW: false,
		KeyS: false,
		KeyP: false,
		Semicolon: false,
	};

	/*	y 좌표를 경기장 폭으로 제한
	function move() {
		const SPEED = 3;
		if (key['KeyW'] && player1.y > 28) {
			if ((player1.y -= SPEED) <= 28) {
				player1.y = 28;
			}
		}
		if (key['KeyS'] && player1.y < 355) {
			if ((player1.y += SPEED) >= 355) {
				player1.y = 355;
			}
		}
		if (key['KeyP'] && player2.y > 28) {
			if ((player2.y -= SPEED) <= 28) {
				player2.y = 28;
			}
		}
		if (key['Semicolon'] && player2.y < 355) {
			if ((player2.y += SPEED) >= 355) {
				player2.y = 355;
			}
		}
	}
*/

	function move() {
		const SPEED = 3;
		if (key['KeyW'] && player1.y > 0) {
			if ((player1.y -= SPEED) <= 0) {
				player1.y = 0;
			}
		}
		if (key['KeyS'] && player1.y < 384) {
			if ((player1.y += SPEED) >= 384) {
				player1.y = 384;
			}
		}
		if (key['KeyP'] && player2.y > 0) {
			if ((player2.y -= SPEED) <= 0) {
				player2.y = 0;
			}
		}
		if (key['Semicolon'] && player2.y < 384) {
			if ((player2.y += SPEED) >= 384) {
				player2.y = 384;
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
