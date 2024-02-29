import Component from '../../core/Component.js';
import { navigate } from '../../router/utils/navigate.js';

export default class extends Component {
	setEvent() {
		this.addEvent('click', '.not-found-btn', () => {
			navigate('/select');
		});
	}
	template() {
		return `
		<div class="body-wrapper">
			<div class="not-found-wrapper">
				<div><span>404 Not Found</span></div>
				<button class="not-found-btn btn btn-danger">메인으로 돌아가기</button>
			</div>
		</div>
		`;
	}
}
