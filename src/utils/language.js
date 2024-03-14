const login = {
	en: {
		loginBtn: 'login',
		languageSelect: 'change',
		gameStartBtn: 'start',
		twoFATitle: 'Two factor authentication ',
		twoFAContent: 'Enter your 2FA code',
		twoFASubmit: 'submit',
		twoFAWarning: 'Verification code is incorrect',
		loading: 'loading',
	},
	kr: {
		loginBtn: '로그인',
		languageSelect: '변경',
		gameStartBtn: '시작하기',
		twoFATitle: '2단계 인증을 해주세요 ',
		twoFAContent: '6자리 코드를 입력하세요.',
		twoFASubmit: '제출',
		twoFAWarning: '인증코드가 잘못되었습니다',
		loading: '로딩중',
	},
	jp: {
		loginBtn: 'login',
		languageSelect: '変更',
		gameStartBtn: '始める',
		twoFATitle: '二要素認証をお願いします',
		twoFAContent: '2FA コードを入力してください',
		twoFASubmit: '提出する',
		twoFAWarning: '認証コードが間違っています',
		loading: '読み込み中',
	},
};

const gameSelect = {
	en: {
		startBtn: 'Start Game',
		roleBtn: 'How to Play',
		roleBox: `Controls: Player 1 controls (W, S) Player 2 controls (P, ;)`,
		roleBox2: `Kick the soccer ball bouncing around in all directions into the goal! If the ball goes out of the field, it's a loss!`,
		roleBox3: `The player who first scores 10 points wins the game.`,
		localMode: '2 Players',
		tournamentMode: 'Tournament',
		remoteMode: 'Online',
		levelOne: 'Basic Mode',
		levelTwo: 'Extreme Mode',
		localModal: 'Two players compete using one keyboard',
		tournamentModal: 'Four players compete in a tournament using one keyboard',
		remoteModal: 'Compete remotely with other players',
	},
	kr: {
		startBtn: '게임 시작',
		roleBtn: '게임 방법',
		roleBox: `조작키 설명: 1P 조작키 (W, S) 2P 조작키 (P, ;)`,
		roleBox2: `사방으로 움직이는 축구공을 골대로 튕겨내세요! 축구장을 벗어나면 패배입니다! `,
		roleBox3: `10점을 먼저 획득하는 플레이어가 게임에서 승리합니다.`,
		localMode: '2인용',
		tournamentMode: '토너먼트',
		remoteMode: '온라인',
		levelOne: '기본모드',
		levelTwo: '익스트림모드',
		localModal: '한 키보드로 두 명의 플레이어가 대결',
		tournamentModal: '하나의 키보드로 4명의 플레이어가 토너먼트 진행',
		remoteModal: '원격으로 다른 플레이어와 경쟁',
	},
	jp: {
		startBtn: 'ゲームスタート',
		roleBtn: '遊び方',
		roleBox: `コントロール: プレイヤー1の操作キー (W、S) プレイヤー2の操作キー (P、;)`,
		roleBox2: `あらゆる方向に跳ね回るサッカーボールをゴールに蹴ります！ ボールがフィールド外に出ると負けです！`,
		roleBox3: `最初に10ポイントを獲得したプレイヤーがゲームに勝ちます。`,
		localMode: '2人用',
		tournamentMode: 'トーナメント',
		remoteMode: 'オンライン',
		levelOne: 'ベーシックモード',
		levelTwo: 'エクストリームモード',
		localModal: '一つのキーボードで2人のプレイヤーが対決',
		tournamentModal: '一つのキーボードで4人のプレイヤーがトーナメントを進行',
		remoteModal: '遠隔で他のプレイヤーと競争',
	},
};

const local = {
	en: {
		normalGameMode: 'Local Normal mode',
		exteamGameMode: 'Local Extream mode',
		localExplain: 'Please enter a player nickname.',
		errorNickname: 'Duplicate nickname. Please re-enter.',
		emptyNickname: 'Please enter all the nicknames.',
		lengthNickname: 'Please enter the nickname in less than 10 characters.',
		gameStartButton: 'Game Start',
		player1: 'Player1',
		player2: 'Player2',
	},
	kr: {
		normalGameMode: '로컬 노말 모드',
		exteamGameMode: '로컬 익스트림 모드',
		localExplain: '플레이어 닉네임을 입력해주세요.',
		errorNickname: '중복된 닉네임 입니다. 다시 입력해주세요.',
		emptyNickname: '닉네임을 모두 입력해주세요.',
		lengthNickname: '닉네임은 10글자 이하로 입력해 해주세요.',
		gameStartButton: '게임 시작',
		player1: '플레이어1',
		player2: '플레이어2',
	},
	jp: {
		normalGameMode: 'ローカルノーマルモード',
		exteamGameMode: 'ローカル·エクストリーム·モード',
		localExplain: 'プレイヤーのニックネームを入力してください',
		errorNickname: '重複しているニックネームです. もう一度入力してください',
		emptyNickname: 'ニックネームをすべて入力してください.',
		lengthNickname: 'ニックネームは10文字以下で入力してください.',
		gameStartButton: 'ゲーム開始',
		player1: 'プレーヤー1',
		player2: 'プレーヤー2',
	},
};

const tournament = {
	en: {
		normalGameMode: 'Tournament Normal Mode',
		extreamGameMode: 'Tournament Extream Mode',
		tournamentExplain1: 'Please enter the tournament participant nickname.',
		tournamentExplain2: 'It will be randomly matched.',
		errorNickname: 'Duplicate nickname. Please re-enter.',
		emptyNickname: 'Please enter all the nicknames.',
		lengthNickname: 'Please enter the nickname in less than 10 characters.',
		startButton: 'Start',
		firstGame: 'The first game',
		secondGame: 'The second game',
		gameStartButton: 'Start',
		player1: 'Player1',
		player2: 'Player2',
		player3: 'Player3',
		player4: 'Player4',
	},
	kr: {
		normalGameMode: '토너먼트 노말 모드',
		extreamGameMode: '토너먼트 익스트림 모드',
		tournamentExplain1: '토너먼트 참가자 닉네임을 입력해주세요.',
		tournamentExplain2: '랜덤으로 매치됩니다.',
		errorNickname: '중복된 닉네임 입니다. 다시 입력해주세요.',
		emptyNickname: '닉네임을 모두 입력해주세요.',
		lengthNickname: '닉네임은 10글자 이하로 입력해 해주세요.',
		startButton: '시작하기',
		firstGame: '4강 첫번째 경기',
		secondGame: '4강 두번째 경기',
		gameStartButton: '경기 시작하기',
		player1: '플레이어1',
		player2: '플레이어2',
		player3: '플레이어3',
		player4: '플레이어4',
	},
	jp: {
		normalGameMode: 'トーナメントノーマルモード',
		extreamGameMode: 'トーナメント·エクストリーム·モード',
		tournamentExplain1: 'トーナメント参加者のニックネームを入力してください.',
		tournamentExplain2: 'ランダムにマッチします.',
		errorNickname: '重複しているニックネームです. もう一度入力してください.',
		emptyNickname: 'ニックネームをすべて入力してください.',
		lengthNickname: 'ニックネームは10文字以下で入力してください.',
		startButton: '始めること',
		firstGame: '準決勝第1戦',
		secondGame: '準決勝第2戦',
		gameStartButton: '試合開始',
		player1: 'プレーヤー1',
		player2: 'プレーヤー2',
		player3: 'プレーヤー3',
		player4: 'プレーヤー4',
	},
};

const game = {
	en: {
		tournamentButton: 'Go to next name',
		localButton: 'Go out of the game',
	},
	kr: {
		tournamentButton: '다음 게임으로',
		localButton: '게임 나가기',
	},
	jp: {
		tournamentButton: '次のゲームへ',
		localButton: 'ゲームに出ること',
	},
};

const remote = {
	en: {
		searchText: 'Searching for participants',
		searchButton: 'Cancel',
		foundText: 'Found a participant!',
		foundButton: 'Get ready',
		waitText: 'Waiting for the other person.',
		waitButton: 'Get ready',
		readyText: 'Found a participant!',
	},
	kr: {
		searchText: '참가자 찾는 중...',
		searchButton: '취소하기',
		foundText: '참가자를 찾았습니다!',
		foundButton: '준비하기',
		waitText: '상대방을 기다리는 중입니다.',
		waitButton: '준비하기',
		readyText: '참가자를 찾았습니다!',
	},
	jp: {
		searchText: '参加者募集中...',
		searchButton: 'キャンセルする',
		foundText: '参加者を見つけました!',
		foundButton: '準備する',
		waitText: '相手を待っています.',
		waitButton: '準備する',
		readyText: '参加者を見つけました!',
	},
};

const util = {
	en: {
		ok: 'OK',
		submit: 'submit',
		chatMessage: 'Chat connection failed.',
		dupMessage: 'Another user is already connected.',
		winCount: 'W',
		loseCount: 'L',
	},
	kr: {
		ok: '확인',
		submit: '전송',
		chatMessage: '채팅 연결에 실패했습니다.',
		dupMessage: '다른 사용자가 이미 접속중입니다.',
		winCount: '승',
		loseCount: '패',
	},
	jp: {
		ok: 'OK',
		submit: '転送',
		chatMessage: 'チャット接続に失敗しました。',
		dupMessage: '他のユーザーはすでにアクセスしています。',
		winCount: '勝',
		loseCount: '負',
	},
};

export default {
	login,
	game,
	gameSelect,
	local,
	remote,
	tournament,
	util,
};
