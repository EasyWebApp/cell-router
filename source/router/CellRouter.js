import {component, Component} from 'web-cell';

import CellRoute from './CellRoute';

import RouteMap from './RouteMap';

import PageStack from './PageStack';

const on = Component.prototype.on, route_map = new RouteMap();

var page;


/**
 * Routes elements wrapper
 */
export default  class CellRouter extends HTMLElement {

    constructor() {

        super();

        /**
         * @type {boolean}
         */
        this.loading = false;
    }

    connectedCallback() {

        document.addEventListener('DOMContentLoaded',  () => {

            page = new PageStack('main', this.getAttribute('mode'));

            on.call(page.container,  'pagechanged',  event => {

                const data = event.detail;

                route_map.trigger(data.to.path, data.to, data.from);
            });
        });

        const router = this;

        on.call(document.body,  'click',  'a[href]',  async function (event) {

            if (this.loading  ||  ((this.target || '_self')  !==  '_self'))
                return;

            event.preventDefault();

            this.loading = true;

            await router.navTo( this );

            this.loading = false;
        });
    }

    /**
     * `path` or `hash`
     *
     * @type {string}
     */
    get mode() {  return page.mode;  }

    /**
     * Key for path, Value for tag
     *
     * @type {object}
     */
    get map() {

        const route = { };

        for (let child of this.children)
            if (child instanceof CellRoute)  route[ child.path ] = child.tag;

        return route;
    }

    /**
     * @protected
     *
     * @type {PageStack}
     */
    get stack() {  return page;  }

    /**
     * @protected
     *
     * @param {Element} link - A `<a href="" />`
     */
    async navTo(link) {

        const path = link.getAttribute('href');

        const tag = CellRoute.map.trigger( path );

        if ( tag )
            await page.push(tag,  path,  link.title || link.textContent.trim());
    }

    /**
     * Register route handler
     *
     * @param {string|RegExp} path    - **Plain path**, **Path with colon parameters** or
     *                                  **Regular expression**
     * @param {RouteHandler}  handler
     *
     * @return {Function} This class
     */
    static route(path, handler) {

        route_map.set(path, handler);

        return this;
    }
}


component( CellRouter );
