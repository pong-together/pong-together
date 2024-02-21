import Component from '../../../core/Component.js';
import http from '../../../core/http.js';
import store from '../../../store/index.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
		};
	}

	setEvent() {
		this.addEvent('click', '#twoFABtn', async (e) => {
			e.preventDefault();
			const inputValue = this.$target.querySelector('#twoFactorCode').value;
			console.log(inputValue);
			try {
				const data = await http.get(
					`https://localhost:443/api/auth/otp/verify/?code=${inputValue}`,
					{
						Authorization: accessToken,
						'Content-Type': 'application/json',
					},
				);
				console.log('otp data', data);
				localStorage.setItem('twoFA', data.authentication);
				store.dispatch('changeLoginProgress', 'language');
			} catch (e) {
				//localStorage.removeItem('accessToken');
				//localStorage.removeItem('twoFA');
				//store.dispatch('changeLoginProgress', 'oauth');
			}
		});
	}

	template() {
		return `
		<div class="row justify-content-center mt-6 login-twoFA-wrapper">
			<div class="col-md-9">
				<h2 class="text-center mb-4">Two-factor authentication (2FA)</h2>
				<div class="text-center mb-4 qrCode">
						<img id="qrCode" src="../../../static/images/loginLoading.png" alt="QR Code" style="width:100px; class="mb-3">
				</div>
				<form id="twoFactorForm">
					<div class="form-group">
							<label for="twoFactorCode">2FA Code</label>
							<input type="text" class="form-control" id="twoFactorCode" placeholder="Enter your 6-digit 2FA code" maxlength="6">
					</div>
					<button class="btn btn-primary" id="twoFABtn">Submit</button>
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
		const data = await http.get('https://localhost:443/api/auth/otp/', {
			Authorization: accessToken,
			'Content-Type': 'application/json',
		});
		this.generateQRCode(data.qrcode_uri);
	}
}
