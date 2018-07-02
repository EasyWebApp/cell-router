import {component, Component} from 'web-cell';

import CellRoute from './CellRoute';

import PageStack from './PageStack';

const on = Component.prototype.on;

var page;


/**
 * Routes elements wrapper
 */
export default  class CellRouter extends HTMLElement {

    constructor() {  super();  }

    connectedCallback() {

        document.addEventListener('DOMContentLoaded',  () => {

            page = new PageStack('main', this.getAttribute('mode'));
        });

        const router = this;

        on.call(document.body,  'click',  'a[href]',  function (event) {

            if ((this.target || '_self')  !==  '_self')  return;

            event.preventDefault();

            router.navTo( this );
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

        const map = CellRoute.map, route = { };

        for (let child of this.children) {

            let item = map.get( child );

            if ( item )  route[ item[0] ] = item[1];
        }

        return route;
    }

    /**
     * @protected
     *
     * @param {Element} link - A `<a href="" />`
     */
    async navTo(link) {

        const path = link.getAttribute('href');

        const tag = this.map[ path ];

        if ( tag )
            await page.turnTo(tag,  path,  link.title || link.textContent.trim());
    }
}


component( CellRouter );
