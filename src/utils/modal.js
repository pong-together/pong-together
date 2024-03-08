import language from './language';
import store from '../store/index';

function displayConnectionFailedModal(text) {
	const $state = store.state;
	if (localStorage.getItem('language')) {
		$state.language = localStorage.getItem('language');
	}
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">
				<p>${text}</p>
				<button id="modal-close-btn">${language.modal[$state.language].ok}</button>
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
