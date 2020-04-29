import { mixin, VNodeChildElement, delegate, createCell } from 'web-cell';
import { walkDOM, scrollTo, formToJSON } from 'web-utility/source/DOM';
import { buildURLData } from 'web-utility/source/URL';

import { History, HistoryMode } from './History';
import { Route, matchRoutes } from './utility';

type LinkElement = HTMLAnchorElement | HTMLAreaElement | HTMLFormElement;

export abstract class HTMLRouter extends mixin<{}, { loading?: boolean }>() {
    state = { loading: false };

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
        if (root.title) return root.title;

        var title = '';

        for (const node of walkDOM(root))
            if (node instanceof Text) {
                const {
                    width,
                    height
                } = node.parentElement.getBoundingClientRect();

                if (width && height) title += node.nodeValue.trim();
            }

        return title;
    }

    get parentRouter(): HTMLRouter | undefined {
        var node = this;
        // @ts-ignore
        while ((node = node.parentNode || node.host))
            if (node instanceof HTMLRouter) return node;
    }

    protected abstract history: History;
    protected abstract routes: Route[];
    private currentPage: VNodeChildElement | VNodeChildElement[];

    handleLink = delegate(
        'a[href], area[href]',
        (event: MouseEvent, link: LinkElement) => {
            const path = HTMLRouter.getInnerPath(link);

            if (!path) return;

            event.preventDefault(), event.stopPropagation();

            if (/^#.+/.test(path)) return scrollTo(path, this);

            this.history.push(path, HTMLRouter.getTitle(link));
        }
    );

    handleForm = delegate(
        'form[action]',
        (event: Event, form: HTMLFormElement) => {
            const path = HTMLRouter.getInnerPath(form);

            if (!path) return;

            event.preventDefault(), event.stopPropagation();

            this.history.push(
                path + '?' + buildURLData(formToJSON(form)),
                form.title
            );
        }
    );

    handleBack = () => this.history.back();

    handleHash = (event: HashChangeEvent) => {
        event.stopImmediatePropagation();

        const { hash } = window.location;
        const path = hash.slice(1);
        const link = this.querySelector<HTMLElement>(`a[href="${path}"]`);

        this.history.replace(
            path,
            link ? link.title || link.textContent : undefined
        );
    };

    connectedCallback() {
        this.history.reset(!!this.parentRouter);

        this.routes = this.routes
            .map(({ paths, ...rest }) =>
                paths.map(path => ({ paths: [path], ...rest }))
            )
            .flat()
            .sort(({ paths: [A] }, { paths: [B] }) =>
                (B as string).localeCompare(A as string)
            );

        super.connectedCallback();

        this.addEventListener('click', this.handleLink);
        this.addEventListener('submit', this.handleForm);
        window.addEventListener('popstate', this.handleBack);

        if (this.history.mode === HistoryMode.hash)
            window.addEventListener('hashchange', this.handleHash);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleLink);
        this.removeEventListener('submit', this.handleForm);
        window.removeEventListener('popstate', this.handleBack);

        if (this.history.mode === HistoryMode.hash)
            window.removeEventListener('hashchange', this.handleHash);
    }

    protected async loadPage(
        tree: Promise<Function>,
        Component: () => Promise<Function>
    ) {
        await this.setState({ loading: true });
        try {
            const func = await tree,
                route = this.routes.find(
                    ({ component }) => component === Component
                );

            if (route) {
                route.component = func;

                this.update();
            }
        } finally {
            await this.setState({ loading: false });
        }
    }

    render() {
        const { component: Component, path, params } =
            matchRoutes(this.routes, this.history.path) || {};

        if (!Component) return;

        const tree = <Component {...params} path={path} />;

        if (!(tree instanceof Promise)) return (this.currentPage = tree);

        this.loadPage(tree, Component as () => Promise<Function>);

        return this.currentPage;
    }
}
