import Component from '../Component.js';
import language from '../../../utils/language.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: 'kr',
		};
	}

	setEvent() {
		this.addEvent('click', '.login-language-select-btn', () => {
			const $select = this.$target.querySelector('#language-select');
			const selectedLanguage = $select.value;
			this.setState({ region: selectedLanguage });
			// header 나온 뒤에 추가
			//http.put('', { language: this.$state.region }, {});
		});

		this.addEvent('click', '#login-to-start', () => {
			window.location.hash = `#/select`;
		});
	}

	template() {
		return `
		<div>
			<div class="language-select">
				<select name="language-select" id="language-select" class="login-language-select-wrapper">
					<option value="kr">
						<img src="./static/korean.png" alt="korean" />한국어
					</option>
					<option value="en">
						<img src="./static/american.png" alt="american" />English
					</option>
					<option value="jp">
						<img src="./static/japanese.png" alt="japanese" />日本語
					</option>
				</select>
				<input type="submit" value="${language.login[this.$state.region].languageSelect}" class="login-language-select-btn" />
			</div>
			<button class="login-btn" id="login-to-start">${language.login[this.$state.region].gameStartBtn}</button>
		</div>`;
	}

	mounted() {
		const $select = this.$target.querySelector('#language-select'); // <select> 요소 선택
		const selectedRegion = this.$state.region; // 선택하고자 하는 region 값

		// <select> 내의 모든 <option> 태그를 순회
		$select.querySelectorAll('option').forEach((option) => {
			if (option.value === selectedRegion) {
				option.selected = true; // 일치하는 value를 가진 <option>에 selected 속성 부여
			}
		});
	}
}
