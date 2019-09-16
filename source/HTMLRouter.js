import { Component, delegate, loadDOM } from 'web-cell';

import History from './History';

import { parseDOM } from 'dom-renderer';


const router_history = Symbol('Router history'),
    route_handler = {
        load: new WeakMap(),
        back: new WeakMap()
    };

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
     * @param {Node} node
     *
     * @return {?HTMLRouter}
     *
     * @see https://web-cell.dev/WebCell/class/source/component/Component.js~Component.html#static-method-instanceOf
     */
    static instanceOf(node) {

        return  Component.instanceOf.call(HTMLRouter, node);
    }

    /**
     * @protected
     *
     * @return {Promise}
     */
    connectedCallback() {

        const path = History.getPath( this.hash ),
            isTop = !HTMLRouter.instanceOf( this.parentNode );
        /**
         * @private
         *
         * @type {History}
         */
        this[router_history] = new History(isTop ? '/' : path,  this.hash);

        this.addEventListener('click', this.onClick);

        if ( isTop )  document.addEventListener('click', this.onClick);

        self.addEventListener(
            'popstate',  ({ state })  =>
                ((state || '').index != null)  &&  this.back( state )
        );

        if (isTop && this.hash && path)
            return  this.load(path,  (self.history.state || '').title);

        for (let path  in  route_handler.load.get( this.constructor ))
            if (/^\/(index\/?)?$/.test( path ))
                return  this.load( path );
    }

    /**
     * @protected
     */
    disconnectedCallback() {

        document.removeEventListener('click', this.onClick);
    }

    /**
     * @private
     */
    onClick = delegate('a[href]',  (event, target) => {
        if (
            ((target.target || '_self') !== '_self')  ||  event.defaultPrevented
        )
            return;

        const path = this.pathOf( target.getAttribute('href') );

        if (path != null) {

            event.preventDefault();

            this.load(path,  target.title || target.textContent.trim());
        }
    });

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

        if (raw.startsWith( base ))  return raw.slice( base.length );
    }

    /**
     * Base path of Page component modules
     *
     * @type {String}
     */
    static get moduleBase() {  return 'dist/';  }

    /**
     * @protected
     *
     * @param {Node[]} page
     */
    turnTo(page) {  this.innerHTML = '',  this.append.apply(this, page);  }

    /**
     * @param {String} path
     *
     * @return {RegExp}
     */
    static patternOf(path) {

        return  RegExp('^' + path.replace(/:(\w+)/g, '(.+?)'));
    }

    /**
     * @private
     *
     * @param {String} type
     * @param {String} path
     * @param {...*}   extra
     *
     * @return {String[]}
     */
    exec(type, path, ...extra) {

        const map = route_handler[type].get( this.constructor );

        for (let route in map) {

            let parameter = map[route].pattern.exec( path );

            if ( parameter )
                return map[route].handler.apply(
                    this,  parameter.slice(1).concat( extra )
                );
        }
    }

    /**
     * Go to a new Page
     *
     * @param {String} path
     * @param {String} [title=document.title]
     */
    async load(path, title) {

        const source = await this.exec('load', path);

        if (!(Object(source) instanceof String))  return;

        const tree = await loadDOM(
                parseDOM( source ),  this.constructor.moduleBase || 'dist/'
            ),
            data = this[router_history].add(path, title, source);

        await this.turnTo(data.tree = Array.from( tree.childNodes ));
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

        if (await this.exec('back', state.path, state) === false)
            return  history.rollback( state );

        history.lastIndex = state.index;

        await this.turnTo( page.tree );
    }
}

// --- Decorators --- //

function route(type, path, meta) {

    meta.finisher = Class => {

        const handler = route_handler[type].get( Class )  ||  { };

        handler[path] = {
            pattern:  HTMLRouter.patternOf( path ),
            handler:  meta.descriptor.value
        };

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
