import {component} from 'web-cell';

const ESM = (! document.querySelector(
        'script[src$="custom-elements-es5-adapter.js"]'
    )),
    page_data = new WeakMap();



@component()
export default  class CellPage extends HTMLElement {

    constructor() {  super();  }

    connectedCallback() {

        const loader = this.parentNode;

        if (loader.tagName === 'CELL-LOADER')
            page_data.set(this, {
                path:  new URL(
                    this.getAttribute('path') || '',  loader.base
                ) + ''
            });
        else
            throw new DOMError(
                '<cell-page /> must be a child of <cell-loader />'
            );
    }

    /**
     * URL of this component
     *
     * @type {string}
     */
    get path() {  return  page_data.get( this ).path;  }

    /**
     * Tag name of this component
     *
     * @type {string}
     */
    get name() {  return  this.path.split('/').slice(-1)[0];  }

    /**
     * @type {boolean}
     */
    get loaded() {  return  (!! window.customElements.get( this.name ));  }

    /**
     * @return {Promise}
     */
    load() {

        return  this.loaded ?
            Promise.resolve() :
            new Promise((resolve, reject)  =>  document.head.append(
                Object.assign(document.createElement('script'), {
                    onload:   resolve,
                    onerror:  reject,
                    type:     ESM ? 'module' : 'text/javascript',
                    src:      `${this.path}.js`
                })
            ));
    }
}
