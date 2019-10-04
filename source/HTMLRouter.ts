import { mixin, delegate } from 'web-cell';

import History from './History';

const NonRoute = /^((\w+:)?\/\/|#|javascript:)/;

export default abstract class HTMLRouter extends mixin() {
    protected abstract history: History;

    constructor() {
        super();

        this.addEventListener('click', delegate('a[href]', this.handleLink));
    }

    handleLink = (event: MouseEvent, link: HTMLAnchorElement) => {
        if ((link.target || '_self') !== '_self') return;

        event.preventDefault(), event.stopPropagation();

        const path = link.getAttribute('href');

        if (path && !NonRoute.test(path))
            this.history.push(path, link.title || link.textContent.trim());
    };
}
