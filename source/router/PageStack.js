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
        this.length = 1;

        /**
         * Index of last page
         *
         * @type {number}
         */
        this.last = 0;

        /**
         * State of last page
         *
         * @type {HistoryState}
         */
        this.lastState = {
            tag: '',  path: '',  title: document.title,  index: this.last
        };

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

        history.replaceState(this.lastState, document.title, '');

        window.addEventListener('popstate',  async event => {

            if ( event.state )  await this.pop( event.state );
        });
    }

    /**
     * @protected
     *
     * @param {string}       event      - Name of a Custom event
     * @param {boolean}      cancelable - Whether this event can be canceled
     * @param {HistoryState} from       - Meta of leaving page
     * @param {HistoryState} to         - Meta of entering page
     *
     * @return {boolean} Whether `event.preventDefault()` invoked
     */
    dispatch(event, cancelable, from, to) {

        return  this.container.dispatchEvent(new CustomEvent(event, {
            bubbles:     true,
            cancelable:  cancelable,
            detail:      {from, to}
        }));
    }

    /**
     * @protected
     *
     * @return {PageStack}
     */
    cache() {

        this[this.last] = this[this.last] || document.createDocumentFragment();

        this[this.last].append(... this.container.childNodes);

        return this;
    }

    /**
     * @protected
     *
     * @param {string} tag     - Tag name of a Page component
     * @param {string} path    - Route path
     * @param {string} [title]
     */
    record(tag, path, title) {

        title = title || document.title;

        this.lastState = {tag,  path,  title,  index: this.last = this.length++};

        history.pushState(
            this.lastState,  title,  ((this.mode === 'hash') ? '#' : '') + path
        );

        document.title = title;
    }

    /**
     * @param {string} tag     - Tag name of a Page component
     * @param {string} path    - Route path
     * @param {string} [title]
     *
     * @emits {PageChangeEvent}
     * @emits {PageChangedEvent}
     */
    async push(tag, path, title) {

        if ( tag.includes('-') )  await CellLoader.load( tag );

        const previous = history.state,
            next = {tag: document.createElement( tag ),  path,  title};

        previous.tag = this.container.children[0] || '';

        if (! this.dispatch('pagechange', true, previous, next))  return;

        this.cache();

        this.container.append( next.tag );

        this.record(tag, path, title);

        this.dispatch('pagechanged', false, previous, next);
    }

    /**
     * @protected
     *
     * @param {HistoryState} state - `state` property of {@link PopStateEvent}
     */
    async pop(state) {

        this.length = Math.max(this.length,  state.index + 1);

        this.lastState.tag = this.container.children[0] || '';

        var tag = this.cache()[this.last = state.index];

        if (! tag) {

            tag = state.tag;

            if ( tag.includes('-'))  await CellLoader.load( tag );

            tag = document.createElement( tag );
        }

        this.container.append( tag );

        state.tag = this.container.children[0];

        this.dispatch(
            'pagechanged',  false,  this.lastState,  this.lastState = state
        );
    }
}

/**
 * @typedef {Object} HistoryState
 *
 * @property {string|Element} tag   - Page component
 * @property {string}         path  - Route path
 * @property {string}         title
 * @property {number}         index - Stack index of a page
 */

/**
 * Before changing a page
 *
 * @typedef {CustomEvent} PageChangeEvent
 *
 * @property {boolean}       bubbles     - `true`
 * @property {boolean}       cancelable  - `true`
 * @property {Object}        detail
 * @property {HistoryState}  detail.from - Leaving page
 * @property {HistoryState}  detail.to   - Entering page
 */

/**
 * After changing a page
 *
 * @typedef {CustomEvent} PageChangedEvent
 *
 * @property {boolean}       bubbles     - `true`
 * @property {boolean}       cancelable  - `false`
 * @property {Object}        detail
 * @property {HistoryState}  detail.from - Leaving page
 * @property {HistoryState}  detail.to   - Entering page
 */
