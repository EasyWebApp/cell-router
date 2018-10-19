import {component} from 'web-cell';

import CellPage from './CellPage';

const loader = new Map();



@component()
/**
 * Page components loader
 */
export default  class CellLoader extends HTMLElement {

    constructor() {  super();  }

    connectedCallback() {

        loader.set(this, {
            base:  new URL(this.getAttribute('base'), this.baseURI) + ''
        });
    }

    disconnectedCallback() {  loader.delete( this );  }

    /**
     * URL base for loading
     *
     * @type {string}
     */
    get base() {  return  loader.get( this ).base;  }

    /**
     * `<cell-page />` children
     *
     * @type {CellPage[]}
     */
    get pageList() {

        return  [... this.children].filter(element => element instanceof CellPage);
    }

    /**
     * All `<cell-page />`s in this page
     *
     * @type {CellPage[]}
     */
    static get pageList() {

        return  [ ].concat(... [... loader.keys()].map(item => item.pageList));
    }

    /**
     * @param {string} tag - Tag name of a Page component
     *
     * @return {Promise}
     */
    static load(tag) {

        return  this.pageList.filter(page => page.name === tag)[0].load();
    }
}
