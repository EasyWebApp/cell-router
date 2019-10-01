export enum HistoryMode {
    hash = '#',
    path = '/'
}

enum HistoryEvent {
    push = 'push',
    pop = 'pop'
}

type HistoryHandler = (path: string, data: any) => void;

interface RouterStore {
    [type: string]: Map<string | RegExp, HistoryHandler[]>;
}

const { location } = window;

const NonRoute = /^((\w+:)?\/\/|#|javascript:)/;

export default class History {
    readonly root = location.pathname;
    mode = HistoryMode.hash;

    private router: RouterStore = {
        push: new Map(),
        pop: new Map()
    };

    constructor(mode?: HistoryMode) {
        this.mode = mode || this.mode;

        document.addEventListener('click', (event: MouseEvent) => {
            const link = event.target as (HTMLAnchorElement | HTMLAreaElement);

            if ((link.target || '_self') !== '_self') return;

            const path = link.getAttribute('href');

            if (!path || NonRoute.test(path)) return;

            event.preventDefault();

            this.push(path, link.title || (link.textContent as string));
        });

        window.addEventListener('popstate', () => this.emit('pop'));
    }

    get path() {
        const base =
            location.origin + (this.root + this.mode).replace(/\/{2,}/g, '/');

        return location.href.indexOf(base)
            ? ''
            : location.href.slice(base.length);
    }

    push(path: string, title = document.title, data = {}) {
        window.history.pushState(
            data,
            (document.title = title),
            (this.root + this.mode + path).replace(/\/{2,}/g, '/')
        );

        this.emit('push');
    }

    static match(path: string, pattern: string | RegExp) {
        return pattern instanceof RegExp
            ? path.match(pattern)
            : !path.indexOf(pattern);
    }

    protected emit(type: keyof typeof HistoryEvent) {
        const router = this.router[type],
            { path } = this;

        if (path)
            for (const [pattern, handlers] of router) {
                const data = History.match(path, pattern);

                if (data) {
                    for (const callback of handlers) callback(path, data);
                    break;
                }
            }
    }

    on(
        type: keyof typeof HistoryEvent,
        path: string | RegExp,
        callback: HistoryHandler
    ) {
        const router = this.router[type];

        var handlers: HistoryHandler[] = [];

        for (const [pattern, handler] of router)
            if (pattern + '' === path + '') {
                handlers = handler;
                break;
            }

        if (!handlers[0]) router.set(path, (handlers = []));

        handlers.push(callback);
    }
}
