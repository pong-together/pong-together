import { routes } from '../router/constants/pages.js';
import NotFound from '../pages/components/NotFound.js';
import Manager from '../utils/componentManager.js';

function Router($container) {
    console.log('!!router');
    this.$container = $container;
    let currentPage = undefined;
    const ManagerC = new Manager();

    const findMatchedRoute = () =>
        routes.find((route) => route.path.test(location.pathname));

    const route = () => {
        console.log("function route")
        const previousPage = currentPage;
        const matchedRoute = findMatchedRoute();
        const TargetPage = matchedRoute?.element || NotFound;
        const TargetPageKey = matchedRoute?.key || 'NotFound';

        if (currentPage === TargetPage) return; // 이미 렌더링된 페이지인 경우 무시

        currentPage = ManagerC.getComponent(TargetPageKey, TargetPage, this.$container);

        if (previousPage && typeof previousPage.destroy === 'function') {
            console.log('destroy previous')
            // previousPage.destroy();
        }
    };

    const init = () => {
        if (!window.routerInitialized) {
            window.routerInitialized = true;
            window.addEventListener('historychange', ({ detail }) => {
                const { to, isReplace } = detail;

                if (isReplace || to === location.pathname) {
                    history.replaceState(null, '', to);
                    console.log('!!');
                } else {
                    history.pushState(null, '', to);
                }

                route();
            });

            window.addEventListener('popstate', route);
        }
    };

    init();
    route();
}

export default Router;
