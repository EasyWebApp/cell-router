import 'urlpattern-polyfill';
import {
    getVisibleText,
    scrollTo,
    formToJSON,
    buildURLData,
    parseURLData,
    delegate,
    isXDomain
} from 'web-utility';
import { observable, action } from 'mobx';

const { location, history } = window;
const baseURL = document.querySelector('base')?.href || location.origin,
    originalTitle = document.querySelector('title')?.textContent.trim();

export class History {
    @observable
    accessor path: string;

    @observable
    accessor oldPath: string;

    constructor() {
        this.restore();

        window.addEventListener('hashchange', this.restore);
        window.addEventListener('popstate', this.restore);

        document.addEventListener(
            'click',
            delegate('a[href], area[href]', this.handleLink.bind(this))
        );
        document.addEventListener(
            'submit',
            delegate('form[action]', this.handleForm)
        );
    }

    protected restore = () => {
        const { state } = history;

        this.push();

        document.title =
            state?.title || this.titleOf() || originalTitle || location.href;
    };

    @action
    push(path = location.href) {
        path = path.replace(baseURL, '');

        if (path === this.path) return path;

        this.oldPath = this.path;

        return (this.path = path);
    }

    static dataOf(path: string) {
        const [before, after] = path.split('#');

        return parseURLData(after || before);
    }

    static match(pattern: string, path?: string) {
        if (!path) return;

        const { pathname, hash } =
            new URLPattern(pattern, baseURL).exec(
                new URL(path.split('?')[0], baseURL)
            ) || {};

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

    handleLink(event: Event, link: HTMLAnchorElement) {
        const path = link.getAttribute('href');

        if ((link.target || '_self') !== '_self' || isXDomain(path)) return;

        event.preventDefault();

        if (path.startsWith('#'))
            try {
                if (document.querySelector(path) || path === '#top')
                    return scrollTo(path, event.currentTarget as Element);
            } catch {}

        const title = History.getTitle(link);

        history.pushState({ title }, (document.title = title), path);

        this.push(path);
    }

    handleForm = (event: Event, form: HTMLFormElement) => {
        const { method, target } = form;

        if (method !== 'get' || (target || '_self') !== '_self') return;

        event.preventDefault();

        const path = form.getAttribute('action'),
            data = buildURLData(formToJSON(form));

        this.push(`${path}?${data}`);
    };
}

export default new History();
