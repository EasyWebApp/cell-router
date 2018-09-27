import {component, Component} from 'web-cell';

import CellRoute from './CellRoute';

import RouteMap from './RouteMap';

import PageStack from './PageStack';

const on = Component.prototype.on, route_map = new RouteMap();

const path_mode = {
    hash:  1,
    path:  1
};

var page;


/**
 * Routes elements wrapper
 */
export default  class CellRouter extends HTMLElement {

    constructor() {

        super();

        /**
         * @type {string}
         */
        this.rootURL = document.URL.split( /\?|#/ )[0];

        /**
         * @type {boolean}
         */
        this.loading = false;
    }

    /**
     * History path mode (`hash` or `path`)
     *
     * @type {string}
     */
    get mode() {

        const value = this.getAttribute('mode');

        return  (value in path_mode)  ?  value  :  'hash';
    }

    set mode(value) {

        if (value in path_mode)
            this.setAttribute('mode',  page.mode = value + '');
    }

    /**
     * Current route path
     *
     * @type {string}
     */
    get path() {

        return  (this.mode === 'hash')  ?
            window.location.hash.slice( 1 )  :
            document.URL.slice( this.rootURL.length );
    }

    /**
     * @private
     */
    async boot() {

        page = new PageStack('main', this.mode);

        on.call(page.container,  'pagechanged',  event => {

            const data = event.detail;

            route_map.trigger(data.to.path, data.to, data.from);
        });

        if ((this.mode !== 'hash')  ||  !this.path)  return;

        const path = this.path;

        history.replaceState({ }, document.title, window.location.pathname);

        await this.navTo( path );
    }

    connectedCallback() {

        on.call(document,  'DOMContentLoaded',  this.boot.bind( this ));

        const router = this;

        on.call(document.body,  'click',  'a[href]',  function (event) {

            if (!router.loading  &&  ((this.target || '_self')  ===  '_self')) {

                event.preventDefault();   router.navTo( this );
            }
        });
    }

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
     * @param {String|URL|Element} link - An URL or Element with `href` attribute
     */
    async navTo(link) {

        this.loading = true;

        if (!(link instanceof HTMLElement))
            link = Object.assign(document.createElement('a'), {
                href:  (new URL(link, window.location) + '')
                    .replace(this.rootURL, '')
            });

        const path = link.getAttribute('href');

        const tag = CellRoute.map.trigger( path );

        if ( tag )
            await page.push(tag,  path,  link.title || link.textContent.trim());

        this.loading = false;
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
