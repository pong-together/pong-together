import Component from '../../core/Component.js';
import { navigate } from '../../router/utils/navigate.js';

export default class NotFound extends Component {
	// static instance = null;

	// static getInstance($container) {
	// 	if (!NotFound.instance) {
	// 		NotFound.instance = new NotFound($container);
	// 	}
	// 	return NotFound.instance;
	// }

	setEvent() {
		this.addEvent('click', '.not-found-btn', () => {
			if (localStorage.getItem('accessToken'))
			 	navigate("/select");
				// window.location.pathname = '/select';
			else navigate("/");
		});
	}
	template() {
		return `
		<div class="body-wrapper">
			<div class="not-found-wrapper">
				<img src="/static/images/sorrysorrysorry.png" alt="sorry" style="width:200px;" />
				<div><span>404 Not Found</span></div>
				<button class="not-found-btn btn btn-danger">메인으로 돌아가기</button>
			</div>
		</div>
		`;
	}

	mounted() {}
}
