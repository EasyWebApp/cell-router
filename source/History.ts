import { observable, action } from 'mobx';

const { location, history } = window;

export enum HistoryMode {
    hash = '#',
    path = '/'
}

export class History {
    protected baseURL: string;

    set base(value: string) {
        const { origin, pathname, hash } = new URL(value, location.href);

        this.baseURL = origin + pathname + hash;
    }

    get base() {
        return this.baseURL;
    }

    @observable
    path = '';

    mode: HistoryMode;

    constructor(mode = HistoryMode.hash) {
        this.mode = mode;
    }

    @action
    push(path: string, title = document.title, data?: any) {
        const { base, mode } = this;

        history.pushState(
            { ...data, base, path, title },
            (document.title = title),
            base + mode + path
        );

        this.path = path;
    }

    @action
    replace(path: string, title = document.title, data?: any) {
        const { base, mode } = this;

        history.replaceState(
            { ...data, base, path, title },
            (document.title = title),
            base + mode + path
        );

        this.path = path;
    }

    @action
    back() {
        const { base, path, title } = history.state || {};

        if (base === this.base) {
            if (typeof path === 'string') this.path = path;
            if (title) document.title = title;
        }
    }

    reset(isSub?: boolean) {
        const { hash, href } = location;

        this.path = '';

        if (!isSub) {
            this.base = hash ? href.slice(0, -hash.length) : href;

            const { base, path, title, ...data } = history.state || {};

            this.replace(hash.slice(1), title, data);
        } else {
            this.base = href;
        }
    }
}
