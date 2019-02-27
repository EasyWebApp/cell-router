import { clearPath } from './utility';


const { pathname } = self.location;


export default  class History extends Array {
    /**
     * @param {String}  [base='/']  - Base path
     * @param {Boolean} [hash=true] - `#` mode
     */
    constructor(base,  hash = true) {

        super();

        /**
         * @type {Number}
         */
        this.lastIndex = -1;

        this.base = base || '/',  this.hash = hash;
    }

    /**
     * @param {Boolean} [hash=true] - `#` mode
     *
     * @return {String}
     */
    static getPath(hash = true) {

        return hash ?
            self.location.hash.slice( 1 ) :
            self.location.pathname.slice( pathname.length );
    }

    /**
     * @private
     *
     * @param {String} raw
     *
     * @return {String}
     */
    pathOf(raw) {

        return  clearPath(`${this.hash ? '#' : ''}${this.base}/${raw}`)
            .replace(/^\//, '');
    }

    /**
     * @param {String} path
     * @param {String} title
     * @param {String} source
     *
     * @return {HistoryState}
     */
    add(path, title, source) {

        const data = { path,  title: title || document.title,  source };

        this.splice(++this.lastIndex, Infinity, data);

        data.index = this.lastIndex;

        self.history.pushState(
            data,  document.title = title,  this.pathOf( path )
        );

        return data;
    }

    /**
     * @type {HistoryState}
     */
    get state() {  return  Object.assign({ },  this[ this.lastIndex ]);  }

    /**
     * @param {HistoryState} state
     */
    rollback(state) {

        const last = this.state;

        delete last.tree;

        self.history.replaceState(
            last,  document.title = last.title,  this.pathOf( last.path )
        );

        this[state.index] = null;
    }
}


/**
 * @typedef {Object} HistoryState
 *
 * @property {String} path
 * @property {String} title
 * @property {String} source
 * @property {Number} index
 */
