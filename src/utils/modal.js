import language from './language';
import store from '../store/index';

function displayConnectionFailedModal() {
	const $state = store.state;
	if (localStorage.getItem('language')) {
		$state.language = localStorage.getItem('language')?localStorage.getItem('language') : 'kr';
	}
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">
				<p>${language.util[$state.language].chatMessage}</p>
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
	const modalHTML = `
		<div class="modal-overlay">
			<div class="modal-content">${text}</div>
		</div>
	`;

	const sleep = async (ms) => {
		await new Promise((resolve) => setTimeout(resolve, ms));
	};

	mainboxElement.innerHTML += modalHTML;
	await sleep(3000);
	const modalOverlay = document.querySelector('.modal-overlay');
	modalOverlay.parentNode.removeChild(modalOverlay);
};

const displayExpiredTokenModal = async (text) => {
	return new Promise((resolve) => {
		const modalHTML = `
			<div class="modal-overlay">
				<div class="modal-content">${text}</div>
			</div>
		`;

		document.body.innerHTML += modalHTML;

		setTimeout(() => {
			const modalOverlay = document.querySelector('.modal-overlay');
			modalOverlay.parentNode.removeChild(modalOverlay);
			resolve();
		}, 1000);
	});
};

export {
	displayConnectionFailedModal,
	displayCanceledMatchingModal,
	displayExpiredTokenModal,
};
