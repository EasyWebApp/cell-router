/**
 * Route map
 */
export default  class RouteMap {

    constructor() {
        /**
         * @protected
         *
         * @type {Map}
         */
        this.map = new Map();
    }

    /**
     * @param {string|RegExp}  route   - **Plain path**, **Path with colon parameters** or
     *                                   **Regular expression**
     * @param {*|RouteHandler} handler
     *
     * @return {RouteMap} This route map
     */
    set(route, handler) {

        const pattern = { route };

        if (route instanceof RegExp)
            pattern.route = route + '',  pattern.pattern = route;
        else {
            if (/\/:[^/]+/.test( route )) {

                pattern.parameter = [ ];

                route = route.replace(
                    /\/:([^/]+)/g,
                    (_, name)  =>  pattern.parameter.push( name ) && '/([^/]+)'
                );
            }

            pattern.pattern = new RegExp(`^${route}`);
        }

        this.map.set(pattern, handler);

        return this;
    }

    /**
     * @param {string} route
     *
     * @return {RouteMap} This route map
     */
    delete(route) {

        for (let item of this.map.keys())
            if (item.route === route)  this.map.delete( item );

        return this;
    }

    /**
     * @param {string} path   - Route path
     * @param {...*}   [data] - Extra data
     *
     * @return {*}
     */
    trigger(path, ...data) {

        for (let route of this.map.entries()) {

            let match = path.match( route[0].pattern );

            if (! match)  continue;

            if (! (route[1] instanceof Function))  return route[1];

            let parameter = { }, index = 1;

            if ( route[0].parameter )
                for (let key of route[0].parameter)
                    parameter[ key ] = match[ index++ ];
            else
                parameter = match.slice(1);

            return  route[1](parameter, ...data);
        }
    }
}

/**
 * Route handler
 *
 * @typedef {function(parameter: Object, data: ...*)} RouteHandler
 */
