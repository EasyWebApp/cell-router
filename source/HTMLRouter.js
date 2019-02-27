import { delegate } from 'web-cell';

import { parseDOM } from 'dom-renderer';

import History from './History';

import { loadModule } from './utility';


const router_history = Symbol('Router history'),
    route_handler = {
        load: new WeakMap(),
        back: new WeakMap()
    },
    { pathname } = self.location,
    ESM = (! document.querySelector(
        'script[src$="custom-elements-es5-adapter.js"]'
    ));

var main;


/**
 * @abstract
 */
export default  class HTMLRouter extends HTMLElement {
    /**
     * @param {Boolean} [hash=true] - `#` mode
     */
    constructor(hash = true) {

        super().hash = hash;

        if (this.constructor === HTMLRouter)
            throw TypeError('HTMLRouter is Abstract Class');
    }

    /**
     * @protected
     */
    connectedCallback() {

        const path = History.getPath( this.hash );
        /**
         * @private
         *
         * @type {History}
         */
        this[router_history] = new History(main ? path : '/',  this.hash);

        this.listen();

        if (!main && this.hash && path)
            this.load(path,  (self.history.state || '').title);

        main = this;
    }

    /**
     * @private
     */
    listen() {

        const that = this;

        document.addEventListener(
            'click',
            delegate('a[href]',  function (event) {

                if ((this.target || '_self')  !==  '_self')  return;

                const path = that.pathOf( this.getAttribute('href') );

                if (path != null) {

                    event.preventDefault();

                    that.load(path,  this.title || this.textContent.trim());
                }
            })
        );

        self.addEventListener(
            'popstate',  ({ state })  =>
                ((state || '').index != null)  &&  this.back( state )
        );
    }

    /**
     * Base path of this router
     *
     * @type {String}
     */
    get base() {  return  this[router_history].base;  }

    /**
     * @type {String}
     */
    get path() {  return  this[router_history].state.path;  }

    /**
     * @private
     *
     * @param {String} raw
     *
     * @return {?String} Matched path
     */
    pathOf(raw) {

        const base = this.base.replace(/\/$/, '');

        if (! raw.indexOf( base ))  return raw.slice( base.length );
    }

    /**
     * Base path of Page component modules
     *
     * @type {String}
     */
    static get moduleBase() {  return 'dist/';  }

    /**
     * @private
     *
     * @param {String} source
     *
     * @return {Node[]}
     */
    static async loadPage(source) {

        const task = [ ];

        source.replace(/<(\w+-\w+)[\s\S]*?>/g,  (_, tag) => {

            if (! self.customElements.get( tag ))
                task.push(loadModule(
                    `${pathname}/${this.moduleBase}/${tag}.js`, ESM
                ));
        });

        await Promise.all( task );

        return  Array.from( parseDOM( source ).childNodes );
    }

    /**
     * @protected
     *
     * @param {Node[]} page
     */
    turnTo(page) {  this.innerHTML = '',  this.append.apply(this, page);  }

    /**
     * Go to a new Page
     *
     * @param {String} path
     * @param {String} [title=document.title]
     */
    async load(path, title) {

        const handler = route_handler.load.get( this.constructor )[ path ];

        const source = handler  &&  await handler.call( this );

        if (!(Object(source) instanceof String))  return;

        const page = await HTMLRouter.loadPage( source ),
            data = this[router_history].add(path, title, source);

        await this.turnTo(data.tree = page);
    }

    /**
     * Back to an existed Page
     *
     * @param {HistoryState} state
     */
    async back(state) {

        const history = this[router_history];

        const page = history[ state.index ];

        if (! page)  return await this.load(state.path, state.title);

        if (state.index === history.lastIndex)  return;

        const handler = route_handler.back.get( this.constructor )[ state.path ];

        if (handler  &&  (await handler.call(this, state) === false))
            return  history.rollback( state );

        history.lastIndex = state.index;

        await this.turnTo( page.tree );
    }
}

// --- Decorators --- //

function route(type, path, meta) {

    meta.finisher = Class => {

        const handler = route_handler[type].get( Class )  ||  { };

        handler[ path ] = meta.descriptor.value;

        route_handler[type].set(Class, handler);
    };
}

/**
 * Decorator of Route `load` handler
 *
 * @param {String} path
 *
 * @return {Function}
 */
export function load(path) {  return  route.bind(null, 'load', path);  }

/**
 * Decorator of Route `back` handler
 *
 * @param {String} path
 *
 * @return {Function}
 */
export function back(path) {  return  route.bind(null, 'back', path);  }
