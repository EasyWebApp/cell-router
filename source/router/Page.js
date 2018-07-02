const location = window.location;

const basePath = location.pathname;


/**
 * Page meta
 */
export default  class Page {
    /**
     * @param {string} mode - History path mode
     */
    constructor(mode) {
        /**
         * Route path
         *
         * @type {string}
         */
        this.path = (mode === 'hash')  ?
            location.hash.slice( 1 )  :  location.pathname.replace(basePath, '');

        /**
         * @type {string}
         */
        this.title = document.title;
    }

    /**
     * @protected
     *
     * @param {Node[]} fragment - DOM content
     *
     * @return {Page} This page
     */
    addContent(fragment) {
        /**
         * Sub DOM tree of this page
         *
         * @type {DocumentFragment}
         */
        this.fragment = document.createDocumentFragment();

        this.fragment.append(... fragment);

        if (fragment = this.fragment.firstElementChild)
            /**
             * Tag name of this Page component
             *
             * @type {string}
             */
            this.tag = fragment.tagName.toLowerCase();

        return this;
    }
}
