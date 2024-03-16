export default class {
	constructor() {
		this.components = {}; // 컴포넌트 인스턴스를 저장하는 객체
	}
	
	getComponent(key, ComponentClass, $container) {
		if (!this.components[key]) {
			// 컴포넌트 인스턴스가 아직 없다면 새로 생성
			this.components[key] = new ComponentClass($container);
		}
		else {
			// delete this.components[key];
			this.destroyComponent(key);
			this.components[key] = new ComponentClass($container);
		}
		return this.components[key];
	}

	destroyComponent(key) {
		if (this.components[key]) {
		//   this.components[key].destroy();
		  delete this.components[key];
		}
	}
}