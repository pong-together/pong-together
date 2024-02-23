import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import store from '../../../store/index.js';
import language from '../../../utils/language.js';

export default class extends Component {
	setEvent() {
		this.addEvent('click', '#twoFABtn', async (e) => {
			e.preventDefault();
			const inputValue = this.$target.querySelector('#twoFactorCode').value;
			const accessToken = 'Bearer ' + localStorage.getItem('accessToken');
			try {
				const data = await http.get(
					`https://localhost:443/api/auth/otp/verify/?code=${inputValue}`,
					{
						Authorization: accessToken,
						'Content-Type': 'application/json',
					},
				);
				if (data.authentication === 'success') {
					localStorage.setItem('twoFA', data.authentication);
					store.dispatch('changeLoginProgress', 'language');
				} else {
					this.$target.querySelector('.twoFAWarning').innerHTML =
						language.login[store.state.language].twoFAWarning;
				}
			} catch (e) {}
		});
	}

	template() {
		return `
		<div class="row justify-content-center mt-6 login-twoFA-wrapper">
			<div class="col-md-9">
				<h2 class="text-center mb-4">${language.login[store.state.language].twoFATitle} (2FA)</h2>
				<div class="text-center mb-4 qrCode">
						<img id="qrCode" src="../../../static/images/loginLoading.png" alt="QR Code" style="width:100px; class="mb-3">
				</div>
				<form id="twoFactorForm" class="column justify-content-center">
						<div class="form-group">
								<label for="twoFactorCode">2FA Code</label>
								<div class="column justify-content-center" style="display: flex; flex-direction: column; align-items: center;">
										<input type="text" class="form-control" id="twoFactorCode" placeholder="${language.login[store.state.language].twoFAContent}" maxlength="6" />
										<div class="twoFAWarning"></div>
										<button class="btn btn-primary" id="twoFABtn">${language.login[store.state.language].twoFASubmit}</button>
								</div>
						</div>
				</form>
			</div>
		</div>
		`;
	}

	generateQRCode(text) {
		let qrElement = this.$target.querySelector('.qrCode');
		let qr = qrcode(0, 'L');
		qr.addData(text);
		qr.make();
		qrElement.innerHTML = qr.createImgTag();
	}

	async mounted() {
		const accessToken = 'Bearer ' + localStorage.getItem('accessToken');

		let qrCodeDummyImg = this.$target.querySelector('#qrCode');
		let angle = 0;
		const loadingInterval = setInterval(() => {
			angle = (angle + 45) % 360;
			qrCodeDummyImg.style.transform = `rotate(${angle}deg)`;
		}, 100);

		try {
			const data = await http.get('https://localhost:443/api/auth/otp/', {
				Authorization: accessToken,
				'Content-Type': 'application/json',
			});
			clearInterval(loadingInterval);
			this.generateQRCode(data.qrcode_uri);
		} catch (e) {
			clearInterval(loadingInterval);
			//console.error('QR 코드 생성 실패');
		}
	}
}
