import App from './pages/components/App.js';
import store from './store/index.js';

new App(document.querySelector('#app'), store).init(document.querySelector('#app'));

// const $body = document.querySelector('#app');
// new Router($body);
