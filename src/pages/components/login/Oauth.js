import Component from '../../../core/Component.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$store = this.$props;
	}

	mounted() {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');

		const data = http.post('http://localhost:8000/api/auth/login/', {
			code: code,
		});
		console.log(data);
		if (data.login === 'success') {
			this.$store.dispatch('login');
			window.location.hash('#/login');
		}
	}
}
