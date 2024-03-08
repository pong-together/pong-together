function displayConnectionFailedModal() {
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">
				<p>채팅 연결에 실패했습니다.</p>
				<button id="modal-close-btn">확인</button>
			</div>
		</div>
	`;

	document.body.innerHTML += modalHTML;
	document.getElementById('modal-close-btn').addEventListener('click', () => {
		const modalOverlay = document.querySelector('.modal-overlay');
		modalOverlay.remove();
		window.location.pathname = '/login';
	});
}

function showDuplicateLoginModal() {
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">
				<p>이미 다른 곳에서 접속 중입니다.</p>
				<button id="modal-close-btn">확인</button>
			</div>
		</div>
	`;

	document.body.innerHTML += modalHTML;
	document.getElementById('modal-close-btn').addEventListener('click', () => {
		const modalOverlay = document.querySelector('.modal-overlay');
		modalOverlay.remove();
		window.location.pathname = '/login';
	});
}

export { displayConnectionFailedModal, showDuplicateLoginModal };
