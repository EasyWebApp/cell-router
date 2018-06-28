/**
 * Page DOM storage
 */
export default  class PageStack {
    /**
     * @param {string} container - CSS selector of Page container
     */
    constructor(container) {

        this.length = this.last = 0;

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
    turnTo(tag) {

        tag = document.createElement( tag );

        this.turnOver().container.append( tag );

        this.last = this.length;

        return this.container.innerHTML;
    }

    /**
     * @param {number} page - Index of a Page component
     *
     * @return {boolean} Whether this page has DOM cache
     */
    backTo(page) {

        this.turnOver( this.last );

        this.last = page;

        page = this[ page ];

        return  page  ?  (this.container.append( page ) || true)  :  false;
    }
}
