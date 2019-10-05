import { observable } from 'mobx';

const { location, history } = window;

export enum HistoryMode {
    hash = '#',
    path = '/'
}

export default class History {
    protected mode: HistoryMode;
    protected root = location.pathname.slice(1);

    @observable
    path: string;

    constructor(mode: HistoryMode = HistoryMode.hash) {
        this.mode = mode;
        this.path =
            mode === HistoryMode.path ? '' : location.hash.split('#')[1];

        var { title } = history.state || '';

        if (title) document.title = title;
        else title = document.title;

        history.replaceState(
            { mode, root: this.root, path: this.path, title },
            title
        );

        window.addEventListener('popstate', ({ state }) => {
            if (!state) return;

            const { mode, root, path, title } = state;

            if (mode !== this.mode || root !== this.root) return;

            if (title) document.title = title;

            this.path = path;
        });
    }

    mount(path: string = location.pathname + location.hash) {
        (this.root = path), (this.path = '');
    }

    push(path: string, title: string, data?: any) {
        if (title) document.title = title;
        else title = document.title;

        history.pushState(
            { ...data, mode: this.mode, root: this.root, path, title },
            title,
            (this.root + this.mode + path).replace(/\/{2,}/g, '/')
        );

        this.path = path;
    }
}
