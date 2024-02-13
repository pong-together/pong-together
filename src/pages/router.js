//// URL 파라미터 이름을 추출하기 위한 정규 표현식
//const ROUTE_PARAMETER_REGEXP = /:(\w+)/g;
//// URL 파라미터 값을 매칭하기 위한 정규 표현식의 일부
//const URL_FRAGMENT_REGEXP = '([^\\/]+)';

//// URL 파라미터를 추출하는 함수
//const extractUrlParams = (route, windowHash) => {
//	const params = {};

//	// 라우트에 파라미터가 없으면 빈 객체 반환
//	if (route.params.length === 0) {
//		return params;
//	}

//	// 현재 해시에서 라우트 정규 표현식에 매칭되는 파라미터 값들을 추출
//	const matches = windowHash.match(route.testRegExp);

//	// 배열의 첫 번째 요소(전체 매치)는 필요 없으므로 제거
//	matches.shift();

//	// 매칭된 파라미터 값들을 라우트에 정의된 파라미터 이름과 매핑
//	matches.forEach((paramValue, index) => {
//		const paramName = route.params[index];
//		params[paramName] = paramValue;
//	});

//	return params;
//};

//export default () => {
//	// 라우트를 저장할 배열
//	const routes = [];
//	// 'Not Found' 상황을 처리할 기본 함수
//	let notFound = () => {};
//	// 라우터 객체
//	const router = {};

//	// 현재 URL의 해시를 기반으로 해당하는 라우트를 찾고 컴포넌트를 실행하는 함수
//	const checkRouter = () => {
//		const { hash } = window.location;

//		// addRoute에서 생성한 new RegExp 객체를 이용해서 정규표현식과 문자열이 일치하는지 검사함
//		const currentRoute = routes.find((route) => {
//			const { testRegExp } = route;
//			return testRegExp.test(hash);
//		});

//		// 매칭되는 라우트가 없으면 notFound 함수 실행
//		if (!currentRoute) {
//			notFound();
//			return;
//		}

//		// URL 파라미터 추출
//		const urlParams = extractUrlParams(currentRoute, window.location.hash);

//		// 라우트의 컴포넌트 실행, URL 파라미터를 인자로 전달
//		currentRoute.component(urlParams);
//		console.log(window.location.hash, currentRoute, urlParams);
//	};

//	// 'Not Found' 처리 함수를 설정하는 메소드
//	router.setNotFound = (cb) => {
//		notFound = cb;
//		return router;
//	};

//	// 새로운 라우트를 추가하는 메소드
//	router.addRoute = (fragment, component) => {
//		const params = [];

//		// URL 파라미터 이름을 추출하고, 정규 표현식을 생성
//		const parsedFragment = fragment
//			.replace(ROUTE_PARAMETER_REGEXP, (match, paramName) => {
//				params.push(paramName);
//				return URL_FRAGMENT_REGEXP;
//			})
//			.replace(/\//g, '\\/');
//		console.log('parsedFragment', parsedFragment);

//		// 생성된 정규 표현식을 사용하여 라우트 객체를 routes 배열에 추가
//		routes.push({
//			testRegExp: new RegExp(`^${parsedFragment}$`), // 생성한 정규표현식을 객체에 등록함
//			component,
//			params,
//		});
//		//console.log('reg Exp', routes);
//		return router;
//	};

//	// 라우터 시작 메소드. 해시 변경 감지 및 초기 라우트 처리
//	router.start = () => {
//		console.log(window.location.hash);
//		window.addEventListener('hashchange', checkRouter);
//		window.addEventListener('load', checkRouter);
//		window.addEventListener('DOMContentLoaded', checkRouter);

//		// 초기 해시 설정
//		if (!window.location.hash) {
//			window.location.hash = '#/login';
//		}

//		// 초기 라우트 처리
//		checkRouter();
//	};

//	// 프로그래매틱하게 해시를 변경하여 라우팅하는 메소드
//	router.navigate = (fragment) => {
//		window.location.hash = fragment;
//	};

//	return router;
//};

import Component from '../components/Component.js';

export default class Router extends Component {
	setup() {
		this.$state = {
			routes: [],
		};
	}

	addRoute(fragment, component) {
		this.$state.routes.push({ fragment, component });
	}

	checkRoutes() {
		const currentRoute = this.$state.routes.find((route) => {
			return route.fragment === window.location.hash;
		});
		if (!currentRoute) {
			window.location.href = './#';
			this.$state.routes[0].component();
			return;
		}
		currentRoute.component();
	}

	start() {
		window.addEventListener('hashchange', this.checkRoutes.bind(this));

		if (!window.location.hash) {
			window.location.hash = '.#/';
		}
		this.checkRoutes();
	}
}
