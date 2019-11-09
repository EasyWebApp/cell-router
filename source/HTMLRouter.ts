import { mixin, delegate } from 'web-cell';

import { History, HistoryMode } from './History';
import { scrollTo } from './utility';

type LinkElement = HTMLAnchorElement | HTMLAreaElement;

export abstract class HTMLRouter extends mixin() {
    static isRoute(link: LinkElement) {
        const path = link.getAttribute('href');

        return (
            (link.target || '_self') === '_self' &&
            /^https?:$/.test(link.protocol) &&
            path !== link.href &&
            path[0] !== '#'
        );
    }

    get parentRouter(): HTMLRouter | undefined {
        var node = this;
        // @ts-ignore
        while ((node = node.parentNode || node.host))
            if (node instanceof HTMLRouter) return node;
    }

    protected abstract history: History;

    handleLink = delegate('a[href]', (event: MouseEvent) => {
        const link = event.target as LinkElement;

        if (HTMLRouter.isRoute(link)) {
            event.preventDefault(), event.stopPropagation();

            this.history.push(
                link.getAttribute('href'),
                link.title || link.textContent
            );
        } else if (/^#.+/.test(link.getAttribute('href'))) {
            event.preventDefault(), event.stopPropagation();

            scrollTo(link.hash, this);
        }
    });

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
        super.connectedCallback();

        this.history.reset(!!this.parentRouter);

        this.addEventListener('click', this.handleLink);
        window.addEventListener('popstate', this.handleBack);

        if (this.history.mode === HistoryMode.hash)
            window.addEventListener('hashchange', this.handleHash);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleLink);
        window.removeEventListener('popstate', this.handleBack);

        if (this.history.mode === HistoryMode.hash)
            window.removeEventListener('hashchange', this.handleHash);
    }
}
