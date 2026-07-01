import 'urlpattern-polyfill';
import { getVisibleText, parseURLData } from 'web-utility';
import { observable, action } from 'mobx';

const { location, navigation } = window;

const basePath = document.querySelector('base')?.getAttribute('href');

const defaultBaseURL = (
    basePath ? new URL(basePath, location.origin) + '' : location.href.split(/\?|#/)[0]
).replace(/\/$/, '');

const originalTitle = document.querySelector('title')?.textContent.trim();

export enum RouterMode {
    hash = '#',
    history = '/'
}

export class History {
    @observable
    accessor path: string;

    @observable
    accessor oldPath: string;

    constructor(
        public baseURL = defaultBaseURL,
        public delimiter: RouterMode = RouterMode.hash
    ) {
        this.restore();

        navigation.addEventListener('navigate', this.handleNavigate);
        navigation.addEventListener('currententrychange', this.restore);
    }

    protected restore = () => {
        const state = navigation.currentEntry.getState() as Record<string, any> | null;

        this.push();

        document.title = state?.title || this.titleOf() || originalTitle || location.href;
    };

    protected shouldIntercept(event: any) {
        if (!event?.canIntercept || event.downloadRequest || event.formData) return false;

        const url = new URL(event.destination.url);
        const baseOrigin = new URL(this.baseURL, location.href).origin;

        if (url.origin !== baseOrigin) return false;

        if (event.hashChange)
            try {
                if (url.hash && (document.querySelector(url.hash) || url.hash === '#top'))
                    return false;
            } catch {
                return true;
            }

        return true;
    }

    handleNavigate = (event: any) => {
        if (!this.shouldIntercept(event)) return;

        event.intercept({
            scroll: 'manual',
            focusReset: 'manual',
            handler: async () => {
                const path = event.destination.url;
                const routePath = this.push(path);
                const sourceTitle = event.sourceElement && History.getTitle(event.sourceElement);
                const title = sourceTitle || this.titleOf(routePath) || document.title;

                document.title = title;
                navigation.updateCurrentEntry({ state: { title } });

                this.push(path);
            }
        });
    };

    @action
    push(path = location.href) {
        path = path.replace(this.baseURL, '');

        if (this.delimiter === RouterMode.hash) path = path.match(/#.*/)?.[0] || RouterMode.hash;

        if (path === this.path) return path;

        this.oldPath = this.path;

        return (this.path = path);
    }

    navigate(path: string, state: Record<string, any> = {}) {
        const title = state.title || this.titleOf(path) || document.title;
        const nextState = { ...state, title };

        navigation.navigate(path, { state: nextState, history: 'push' });

        document.title = title;

        this.push(path);
    }

    static dataOf(path: string) {
        const [before, after] = path.split('#');

        return parseURLData(after || before);
    }

    match(pattern: string, path = this.path) {
        if (!path) return;

        const Pattern = (window as any).URLPattern;
        const { pathname, hash } =
            new Pattern(pattern, this.baseURL).exec(new URL(path.split('?')[0], this.baseURL)) ||
            {};

        return (hash || pathname)?.groups;
    }

    static getTitle(root: HTMLElement) {
        return root.title || getVisibleText(root);
    }

    titleOf(path = this.path) {
        path = path.replace(/^\//, '');

        if (path)
            for (const node of document.querySelectorAll<HTMLAnchorElement>(
                `a[href="${path}"], area[href="${path}"]`
            )) {
                const title = History.getTitle(node);

                if (title) return title;
            }
    }
}
