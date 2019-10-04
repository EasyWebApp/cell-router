import { observable } from 'mobx';

export default class History {
    static get path() {
        return window.location.hash.slice(1);
    }
    static get title() {
        return (window.history.state || '').title || document.title;
    }

    @observable
    path = History.path;

    constructor() {
        const { title } = History;

        window.history.replaceState({ title }, (document.title = title));

        window.addEventListener('popstate', () => {
            document.title = History.title;

            this.path = History.path;
        });
    }

    push(path: string, title = document.title, data?: any) {
        window.history.pushState(
            { ...data, title },
            (document.title = title),
            '#' + path
        );

        this.path = path;
    }
}
