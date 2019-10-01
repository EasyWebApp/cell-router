export enum HistoryMode {
    hash = '#',
    path = '/'
}

const { location } = window;

export default class History {
    readonly root = location.pathname;
    mode = HistoryMode.hash;

    constructor(mode?: HistoryMode) {
        this.mode = mode || this.mode;
    }

    get path() {
        return location.href.slice(
            (location.origin + (this.root + this.mode).replace(/\/{2,}/g, '/'))
                .length
        );
    }

    push(path: string, title = document.title, data = {}) {
        window.history.pushState(
            data,
            (document.title = title),
            (this.root + this.mode + path).replace(/\/{2,}/g, '/')
        );
    }
}
