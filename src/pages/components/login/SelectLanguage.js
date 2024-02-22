import Component from '../../../core/Component.js';
import language from '../../../utils/language.js';
import store from '../../../store/index.js';
import http from '../../../core/http.js';

export default class extends Component {
	setup() {
		this.$state = {
			region: store.state.language,
		};
	}

	setEvent() {
		this.addEvent('click', '.login-language-select-btn', () => {
			const $select = this.$target.querySelector('#language-select');
			const selectedLanguage = $select.value;
			this.setState({ region: selectedLanguage });
			localStorage.setItem('language', this.$state.region);
			store.dispatch('changeLanguage', this.$state.region);

			//console.log(store.state);
			// header 나온 뒤에 추가
			//http.put('', { language: this.$state.region }, {});
		});

		this.addEvent('click', '#login-to-start', () => {
			window.location.hash = `#/select`;
		});
	}

	template() {
		return `
		<img src="../../../static/images/logoWhite.png" alt="white logo" class="login-logo"/ >
			<div class="login-content-wrapper">
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
				<input type="submit" value="${language.login[store.state.language].languageSelect}" class="login-language-select-btn" />
			</div>
			<button class="login-btn" id="login-to-start">${language.login[store.state.language].gameStartBtn}</button>
		</div>
		</div>`;
	}

	mounted() {
		const $select = this.$target.querySelector('#language-select');
		const selectedRegion = this.$state.region;

		$select.querySelectorAll('option').forEach((option) => {
			if (option.value === selectedRegion) {
				option.selected = true;
			}
		});
	}
}
