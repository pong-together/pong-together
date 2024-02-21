const login = {
	en: {
		loginBtn: 'login',
		languageSelect: 'change',
		gameStartBtn: 'start',
	},
	kr: {
		loginBtn: '로그인',
		languageSelect: '변경',
		gameStartBtn: '시작하기',
	},
	jp: {
		loginBtn: 'login',
		languageSelect: '変更',
		gameStartBtn: '始める',
	},
};

const gameSelect = {
	en: {
		startBtn: 'Start Game',
		roleBtn: 'How to Play',
		roleBox: `Key Control Explanation\n In local mode, player1\n player2 use left and right keys\n In remote mode, use left and right keys\n`,
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
		roleBox: `조작키 설명\n 로컬의 경우에 player1\n player2 좌우 방향키\n 원격은 좌우 방향키\n`,
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
		roleBox: `操作キー説明\n ローカルモードでは、プレイヤー1\n プレイヤー2 左右のキー\n リモートでは、左右のキーを使用します\n`,
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
		normalGameMode: "Local Normal mode",
		exteamGameMode: "Local Extream mode",
		localExplain: "Please enter a player nickname.",
		errorNickname: "Duplicate nickname. Please re-enter.",
		emptyNickname: "Please enter all the nicknames.",
		lengthNickname: "Please enter the nickname in less than 10 characters.",
		gameStartButton: "Game Start",
		player1: "Player1",
		player2: "Player2"
	},
	kr: {
		normalGameMode: "로컬 노말 모드",
		exteamGameMode: "로컬 익스트림 모드",
		localExplain: "플레이어 닉네임을 입력해주세요.",
		errorNickname: "중복된 닉네임 입니다. 다시 입력해주세요.",
		emptyNickname: "닉네임을 모두 입력해주세요.",
		lengthNickname: "닉네임은 10글자 이하로 입력해 해주세요.",
		gameStartButton: "게임 시작",
		player1: "플레이어1",
		player2: "플레이어2"
	},
	jp: {
		normalGameMode: "ローカルノーマルモード",
		exteamGameMode: "ローカル·エクストリーム·モード",
		localExplain: "プレイヤーのニックネームを入力してください",
		errorNickname: "重複しているニックネームです. もう一度入力してください",
		emptyNickname: "ニックネームをすべて入力してください.",
		lengthNickname: "ニックネームは10文字以下で入力してください.",
		gameStartButton: "ゲーム開始",
		player1: "プレーヤー1",
		player2: "プレーヤー2"
	},
};

const tournament = {
	en: {
		normalGameMode: "Tournament Normal Mode",
		extreamGameMode: "Tournament Extream Mode",
		tournamentExplain1: "Please enter the tournament participant nickname.",
		tournamentExplain2: "It will be randomly matched.",
		errorNickname: "Duplicate nickname. Please re-enter.",
		emptyNickname: "Please enter all the nicknames.",
		lengthNickname: "Please enter the nickname in less than 10 characters.",
		startButton: "Start",
		firstGame: "The first game of the semifinals",
		secondGame: "The second game of the semifinals",
		gameStartButton: "Beginning of a game",
		player1: "Player1",
		player2: "Player2",
		player3: "Player3",
		player4: "Player4"
	},
	kr: {
		normalGameMode: "토너먼트 노말 모드",
		extreamGameMode: "토너먼트 익스트림 모드",
		tournamentExplain1: "토너먼트 참가자 닉네임을 입력해주세요.",
		tournamentExplain2: "랜덤으로 매치됩니다.",
		errorNickname: "중복된 닉네임 입니다. 다시 입력해주세요.",
		emptyNickname: "닉네임을 모두 입력해주세요.",
		lengthNickname: "닉네임은 10글자 이하로 입력해 해주세요.",
		startButton: "시작하기",
		firstGame: "4강 첫번째 경기",
		secondGame: "4강 두번째 경기",
		gameStartButton: "경기 시작하기",
		player1: "플레이어1",
		player2: "플레이어2",
		player3: "플레이어3",
		player4: "플레이어4"
	},
	jp: {
		normalGameMode: "トーナメントノーマルモード",
		extreamGameMode: "トーナメント·エクストリーム·モード",
		tournamentExplain1: "トーナメント参加者のニックネームを入力してください.",
		tournamentExplain2: "ランダムにマッチします.",
		errorNickname: "重複しているニックネームです. もう一度入力してください.",
		emptyNickname: "ニックネームをすべて入力してください.",
		lengthNickname: "ニックネームは10文字以下で入力してください.",
		startButton: "始めること",
		firstGame: "準決勝第1戦",
		secondGame: "準決勝第2戦",
		gameStartButton: "試合開始",
		player1: "プレーヤー1",
		player2: "プレーヤー2",
		player3: "プレーヤー3",
		player4: "プレーヤー4"
	},
};

const game = {
	en: {},
	kr: {},
	jp: {},
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

export default {
	login,
	game,
	gameSelect,
	local,
	remote,
	tournament,
};
