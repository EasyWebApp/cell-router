import {View} from 'web-cell';

import CellLoader from '../loader/CellLoader';


/**
 * Page DOM storage
 */
export default  class PageStack {
    /**
     * @param {string} container - CSS selector of Page container
     */
    constructor(container) {
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
    }

    /**
     * @protected
     *
     * @param {number} index
     *
     * @return {PageStack}
     */
    turnOver(index) {

        index = (index != null)  ?  index  :  this.length++;

        (this[ index ] = this[ index ]  ||  document.createDocumentFragment())
            .append(... this.container.childNodes);

        return this;
    }

    /**
     * @param {string} tag - Tag name of a Page component
     *
     * @return {string} HTML source of this page
     */
    async turnTo(tag) {

        if ( tag.includes('-') )  await CellLoader.load( tag );

        tag = document.createElement( tag );

        this.turnOver().container.append( tag );

        this.last = this.length;

        return this.container.innerHTML;
    }

    /**
     * @param {number} page      - Index of a Page component
     * @param {string} [HTML=''] - Fallback HTML source
     */
    async backTo(page, HTML) {

        this.turnOver( this.last );

        page = this[this.last = page];

        if ((! page)  &&  HTML) {

            await Promise.all(
                (HTML.match( /<\w+-\w+/g ) || [ ]).map(
                    raw  =>  CellLoader.load( raw.slice(1) )
                )
            );

            page = View.parseDOM( HTML );
        }

        this.container.append(page || '');
    }
}
