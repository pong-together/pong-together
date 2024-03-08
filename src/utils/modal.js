function displayConnectionFailedModal(text) {
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">
				<p>${text}</p>
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

export { displayConnectionFailedModal };
