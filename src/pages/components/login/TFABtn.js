import Component from '../../../core/Component.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
		};
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
								<input type="text" class="form-control" id="twoFactorCode" placeholder="Enter your 2FA code">
						</div>
						<button type="submit" class="btn btn-primary">Submit</button>
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

		// QR 코드를 div 요소에 추가
		qrElement.innerHTML = qr.createImgTag();
	}

	async mounted() {
		const accessToken = 'Bearer ' + localStorage.getItem('accessToken');
		const data = await http.get(
			'https://localhost:443/api/auth/otp/?intra_id=sooyang',
			{
				Authorization: accessToken,
				'Content-Type': 'application/json',
			},
		);
		this.generateQRCode(data.qrcode_uri);
	}
}
