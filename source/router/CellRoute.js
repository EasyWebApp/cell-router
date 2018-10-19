import {component} from 'web-cell';

import RouteMap from './RouteMap';

const path_tag = new WeakMap(), route_map = new RouteMap();



@component()
/**
 * Route entry
 */
export default  class CellRoute extends HTMLElement {

    constructor() {  super();  }

    connectedCallback() {

        if (this.parentNode.tagName !== 'CELL-ROUTER')
            throw new DOMError(
                '<cell-route /> must be a child of <cell-router />'
            );

        const path = this.getAttribute('path'), tag = this.getAttribute('tag');

        path_tag.set(this,  {path, tag});

        route_map.set(path, tag);
    }

    /**
     * @type {string}
     */
    get path() {  return  path_tag.get( this ).path;  }

    /**
     * Tag name of a Page component
     *
     * @type {string}
     */
    get tag() {  return  path_tag.get( this ).tag;  }

    /**
     * @protected
     *
     * @type {RouteMap}
     */
    static get map() {  return route_map;  }
}
