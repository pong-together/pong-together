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
				<button class="modal-close-btn">${language.util[$state.language].ok}</button>
			</div>
		</div>
	`;

	document.body.innerHTML += modalHTML;
	document.querySelector('.modal-close-btn').addEventListener('click', () => {
		const modalOverlay = document.querySelector('.modal-overlay');
		modalOverlay.remove();
		window.location.pathname = '/login';
	});
}

const displayCanceledMatchingModal = async (text, mainboxElement) => {
	const sleep = async (ms) => {
		await new Promise((resolve) => setTimeout(resolve, ms));
	};

	const overlayElement = document.createElement('div');
	const contentElement = document.createElement('div');
	mainboxElement.appendChild(overlayElement);
	overlayElement.appendChild(contentElement);
	overlayElement.className = 'modal-overlay';
	contentElement.className = 'modal-content';
	contentElement.textContent = text;
	await sleep(3000);
	const modalOverlay = document.querySelector('.modal-overlay');
	modalOverlay.parentNode.removeChild(modalOverlay);
};

export { displayConnectionFailedModal, displayCanceledMatchingModal };
