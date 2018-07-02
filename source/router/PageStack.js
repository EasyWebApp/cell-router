import {View} from 'web-cell';

import Page from './Page';

import CellLoader from '../loader/CellLoader';


/**
 * Page DOM storage
 */
export default  class PageStack {
    /**
     * @param {string} container     - CSS selector of Page container
     * @param {string} [mode='hash'] - History path mode (`hash` or `path`)
     */
    constructor(container, mode) {
        /**
         * Page count
         *
         * @type {number}
         */
        this.length = 0;

        /**
         * Index of last page
         *
         * @type {number}
         */
        this.last = 0;

        /**
         * Page container
         *
         * @type {Element}
         */
        this.container = document.querySelector( container );

        /**
         * History path mode (`hash` or `path`)
         *
         * @type {string}
         */
        this.mode = mode || 'hash';

        this.addHistory('', '', '', this.last, true);

        window.addEventListener('popstate',  async event => {

            if ( event.state )  await this.backTo( event.state );
        });
    }

    /**
     * @protected
     *
     * @param {string}  tag
     * @param {string}  path
     * @param {string}  title
     * @param {number}  index
     * @param {boolean} replace
     */
    addHistory(tag, path, title, index, replace) {

        window.history[`${replace ? 'replace' : 'push'}State`](
            {
                tag,  path,  title,
                index:  this[replace ? 'length' : 'last'] = index,
                HTML:   this.container.innerHTML
            },
            title = title || document.title,
            ((this.mode === 'hash')  ?  '#'  :  '')  +  path
        );

        document.title = title;
    }

    /**
     * @protected
     *
     * @param {string}  event      - Name of a Custom event
     * @param {boolean} cancelable - Whether this event can be canceled
     * @param {number}  from       - Index of leaving page
     * @param {Object}  to         - Meta of entering page
     *
     * @return {boolean} Whether `event.preventDefault()` invoked
     */
    emit(event, cancelable, from, to) {

        return  this.container.dispatchEvent(new CustomEvent(event, {
            bubbles:     true,
            cancelable:  cancelable,
            detail:      {
                from:  this[ from ],
                to:    to
            }
        }));
    }

    /**
     * @protected
     *
     * @param {number} [index]
     *
     * @return {Page}
     */
    turnOver(index) {

        index = (index != null)  ?  index  :  this.length++;

        return (
            this[ index ] = this[ index ]  ||  new Page( this.mode )
        ).addContent(
            this.container.childNodes
        );
    }

    /**
     * @param {string} tag     - Tag name of a Page component
     * @param {string} path    - Route path
     * @param {string} [title]
     *
     * @emits {PageChangeEvent}
     * @emits {PageChangedEvent}
     */
    async turnTo(tag, path, title) {

        const page = {tag, path, title};

        if ( tag.includes('-') )  await CellLoader.load( tag );

        tag = document.createElement( tag );

        this.turnOver();

        if (! this.emit('pagechange', true, this.last, page))  return;

        this.container.append( tag );

        this.addHistory(page.tag, path, title, this.length);

        page.tag = tag;

        this.emit('pagechanged',  false,  this.last - 1,  page);
    }

    /**
     * @protected
     *
     * @param {Object} state       - `event.state`
     * @param {string} state.tag
     * @param {string} state.path
     * @param {string} state.title
     * @param {number} state.index
     * @param {string} state.HTML
     *
     * @emits {PageChangeEvent}
     * @emits {PageChangedEvent}
     */
    async backTo(state) {

        var page = {tag: state.tag,  path: state.path,  title: state.title},
            last = this.last;

        if (! this.emit('pagechange', true, last, page))  return;

        this.turnOver( last );

        var _page_ = this[this.last = state.index];

        if ((! _page_)  &&  state.HTML) {

            await Promise.all(
                (state.HTML.match( /<\w+-\w+/g ) || [ ]).map(
                    raw  =>  CellLoader.load( raw.slice(1) )
                )
            );

            this.container.append( View.parseDOM( state.HTML ) );
        } else
            this.container.append(_page_.fragment || '');

        this.addHistory(page.tag, page.path, page.title, this.last, true);

        page.tag = this.container.firstElementChild;

        this.emit('pagechanged', false, last, page);
    }
}


/**
 * Before changing a page
 *
 * @typedef {CustomEvent} PageChangeEvent
 *
 * @property {boolean} bubbles     - `true`
 * @property {boolean} cancelable  - `true`
 * @property {Object}  detail
 * @property {Page}    detail.from - Leaving page
 * @property {Object}  detail.to   - Entering page
 */


/**
 * After changing a page
 *
 * @typedef {CustomEvent} PageChangedEvent
 *
 * @property {boolean} bubbles     - `true`
 * @property {boolean} cancelable  - `false`
 * @property {Object}  detail
 * @property {Page}    detail.from - Leaving page
 * @property {Object}  detail.to   - Entering page
 */
