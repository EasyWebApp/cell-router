import { mixin, delegate } from 'web-cell';

import { History } from './History';

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

    push = delegate('a[href]', (event: MouseEvent) => {
        const link = event.target as LinkElement;

        if (HTMLRouter.isRoute(link)) {
            event.preventDefault(), event.stopPropagation();

            this.history.push(
                link.getAttribute('href'),
                link.title || link.textContent
            );
        } else if (/^#.+/.test(link.getAttribute('href'))) {
            const anchor = this.querySelector(link.hash);

            if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
        }
    });

    back = () => this.history.back();

    connectedCallback() {
        super.connectedCallback();

        const { hash, href } = window.location;

        if (!this.parentRouter) {
            this.history.base = hash ? href.slice(0, -hash.length) : href;

            const { base, path, title, ...data } = history.state || {};

            this.history.replace(hash.slice(1), title, data);
        } else {
            this.history.base = href;
        }

        this.addEventListener('click', this.push);
        window.addEventListener('popstate', this.back);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.push);
        window.removeEventListener('popstate', this.back);
    }
}
