import {component, View} from 'web-cell';

import CellRoute from './CellRoute';

import PageStack from './PageStack';

const on = CellRoute.prototype.on;

var mode = 'hash', page, prefix = '';


/**
 * Routes elements wrapper
 */
export default  component(class CellRouter extends HTMLElement {

    constructor() {  super();  }

    connectedCallback() {

        document.addEventListener('DOMContentLoaded',  () => {

            page = new PageStack('main');

            window.history.replaceState(
                {
                    title:  document.title,
                    index:  page.last,
                    HTML:   page.container.innerHTML
                },
                document.title,
                ''
            );
        });

        mode = this.listen().getAttribute('mode') || mode;

        if (mode === 'hash')  prefix = '#';
    }

    /**
     * `path` or `hash`
     *
     * @type {string}
     */
    get mode() {  return mode;  }

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
    navTo(link) {

        const path = link.getAttribute('href'),
            title = link.title || link.textContent.trim();

        var tag = this.map[ path ];

        if (! tag)  return;

        const HTML = page.turnTo( tag );

        window.history.pushState(
            {path,  tag,  title,  index: page.last,  HTML},  title,  prefix + path
        );

        document.title = title;
    }

    /**
     * @return {CellRouter} This element
     */
    listen() {

        const router = this;

        on.call(document.body,  'click',  'a[href]',  function (event) {

            if ((this.target || '_self')  !==  '_self')  return;

            event.preventDefault();

            router.navTo( this );
        });

        window.addEventListener('popstate',  event => {

            const state = event.state;

            if (! state)  return;

            if (! page.backTo( state.index ))
                page.container.append( View.parseDOM( state.HTML ) );

            document.title = state.title;
        });

        return this;
    }
});
