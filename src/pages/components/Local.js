import Component from '../../core/Component.js';
import language from '../../utils/language.js';

export default class extends Component {
	setup() {
		this.$state = {
			participant: ['', ''],
			checkError: '',
			gameMode: '2인용 기본게임',
			region: localStorage.getItem('language')
				? localStorage.getItem('language')
				: 'kr',
		};
		console.log(this.$state.region);
	}

	template() {
		return `
		<div class="main-container">
				<div class="info">${language.local[this.$state.region].normalGameMode}</div>
				<div class="contain">
					<div class="explaination">${language.local[this.$state.region].localExplain}</div>
					<div class="local-nick-container">
						<input type="text" class="local-nick1" id="nickname" placeholder="${language.local[this.$state.region].player1}">
						<input type="text" class="local-nick2" id="nickname" placeholder="${language.local[this.$state.region].player2}">
					</div>
					<div class="error-nickname">${this.$state.checkError}</div>
					<button class="local-start">${language.local[this.$state.region].gameStartButton}</button>
				</div>
			</div>
		`;
	}

	setEvent() {
		this.addEvent('click', '.local-start', ({ target }) => {
			const localPrev = this.$state.checkDouble;
			this.localInputNickname(target, localPrev);
		});
	}

	localCheckDuplicate(localNicknames) {
		const seen = {};
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (seen[nickname]) {
				this.setState({
					checkError: `${language.local[this.$state.region].errorNickname}`,
				});
				return true;
			}
			seen[nickname] = true;
		}
		this.setState({ checkDouble: '' });
		return false;
	}

	localCheckEmpty(localNicknames) {
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (!nickname) {
				this.setState({
					checkError: `${language.local[this.$state.region].emptyNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	localCheckLength(localNicknames) {
		for (let i = 0; i < localNicknames.length; i++) {
			const nickname = localNicknames[i];
			if (nickname.length > 10) {
				this.setState({
					checkError: `${language.local[this.$state.region].lengthNickname}`,
				});
				return true;
			}
		}
		this.setState({ checkError: '' });
		return false;
	}

	localInputNickname(target, localPrev) {
		const localNicknames = [];
		const localNickname1 = document.querySelector('.local-nick1').value;
		const localNickname2 = document.querySelector('.local-nick2').value;
		localNicknames.push(localNickname1);
		localNicknames.push(localNickname2);

		if (
			this.localCheckEmpty(localNicknames) ||
			this.localCheckDuplicate(localNicknames) ||
			this.localCheckLength(localNicknames)
		)
			return true;
		return false;
	}

	mounted() {
		if (
			!localStorage.getItem('accessToken') ||
			!localStorage.getItem('twoFA')
		) {
			window.location.pathname = '/login';
			navigate('/login');
		}
	}
}
