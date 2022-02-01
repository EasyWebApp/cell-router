import { createQueue } from 'iterable-observer';
import { getVisibleText, scrollTo, formToJSON , buildURLData } from 'web-utility';

export type LinkElement = HTMLAnchorElement | HTMLAreaElement | HTMLFormElement;

export enum PathPrefix {
    hash = '#',
    path = '/'
}

export type PathMode = keyof typeof PathPrefix;

const { location, history } = window;

export class History {
    stream = createQueue<string>();
    paths: string[] = [];
    prefix: PathPrefix;

    get path() {
        return location[
            this.prefix === PathPrefix.hash ? 'hash' : 'pathname'
        ].slice(1);
    }

    constructor(mode: PathMode = 'hash') {
        this.prefix = PathPrefix[mode];
    }

    [Symbol.asyncIterator]() {
        return this.stream.observable[Symbol.asyncIterator]();
    }

    async set(path: string, title = document.title) {
        if (!this.paths.includes(path)) this.paths.push(path);

        await this.stream.process(path);

        document.title = title;
    }

    push(path: string, title = document.title) {
        history.pushState({ path, title }, title, this.prefix + path);

        return this.set(path, title);
    }

    replace(path: string, title = document.title) {
        history.replaceState({ path, title }, title, this.prefix + path);

        return this.set(path, title);
    }

    compare(last: string, next: string) {
        for (const path of this.paths)
            if (last === path) return -1;
            else if (next === path) return 1;

        return 0;
    }

    static getInnerPath(link: LinkElement) {
        const path = link.getAttribute('href') || link.getAttribute('action');

        if (
            (link.target || '_self') === '_self' &&
            !path.match(/^\w+:/) &&
            (!(link instanceof HTMLFormElement) ||
                (link.getAttribute('method') || 'get').toLowerCase() === 'get')
        )
            return path;
    }

    static getTitle(root: HTMLElement) {
        return root.title || getVisibleText(root);
    }

    handleClick = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest<
            HTMLAnchorElement | HTMLAreaElement
        >('a[href], area[href]');

        if (!link) return;

        const path = History.getInnerPath(link);

        if (!path) return;

        event.preventDefault();

        if (/^#.+/.test(path))
            return scrollTo(path, event.currentTarget as Element);

        this.push(path, History.getTitle(link));
    };

    handleForm = (event: Event) => {
        const form = event.target as HTMLFormElement;
        const path = History.getInnerPath(form);

        if (!path) return;

        event.preventDefault();

        this.push(path + '?' + buildURLData(formToJSON(form)), form.title);
    };

    private popping = false;

    listen(root: Element) {
        root.addEventListener('click', this.handleClick);
        root.addEventListener('submit', this.handleForm);

        if (this.prefix === PathPrefix.hash)
            window.addEventListener(
                'hashchange',
                () => this.popping || this.set(this.path)
            );

        window.addEventListener('popstate', async ({ state }) => {
            const { path = this.path, title } = state || {};

            this.popping = true;

            await this.set(path, title);

            this.popping = false;
        });

        setTimeout(() => this.replace(this.path, (history.state || {}).title));

        return this;
    }
}
