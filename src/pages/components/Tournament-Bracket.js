import Component from "./Component.js"

export default class extends Component {
	template() {
		return `
			<div class="main-container-bracket">
			<div class="info">임시 게임 모드</div>
				<div class="bracket-container">
				<div class="tournament-bracket">
					<div class="crownball">
						<div class="tournament-crown"></div>
						<div class="tournament-ball"></div>
					</div>
					<div class="finalgame-winner-line"></div>
					<div class="finalgame-line-container">
						<div class="finalgame-rightline"></div>
						<div class="finalgame-vertline1"></div>
						<div class="finalgame-vertline2"></div>
						<div class="finalgame-leftline"></div>
					</div>
					<div class="winner-players">
						<div class="game1-winner" id="player">player1</div>
						<div class="game2-winner" id="player">player4</div>
					</div>
					<div class="winner-line-container">
						<div class="game1-winner-line"></div>
						<div class="game2-winner-line"></div>
					</div>
					<div class="connector">
						<div class="game1-rightline"></div>
						<div class="game1-vertline1"></div>
						<div class="game1-vertline2"></div>
						<div class="game1-leftline"></div>
						<div class="game2-rightline"></div>
						<div class="game2-vertline1"></div>
						<div class="game2-vertline2"></div>
						<div class="game2-leftline"></div>
					</div>
					<div class="players">
						<div class="player1" id="player">player1</div>
						<div class="player2" id="player">player2</div>
						<div class="player3" id="player">player3</div>
						<div class="player4" id="player">player4</div>
					</div>
				</div>
				<div class="gameinfo-container">
					<div class="firstgame-info1">4강 첫번째 경기</div>
					<div class="firstgame-info2">4강 두번째 경기</div>
				</div>
				<button class="start">경기 시작하기</button>
			</div>
		</div>
		`
	}

	mounted() {
	}
}