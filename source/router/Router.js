/**
 * Router core
 */
export default  class Router {

    constructor() {
        /**
         * @protected
         *
         * @type {Map}
         */
        this.map = new Map();
    }

    /**
     * @param {string}                                route   - **Plain path** or
     *                                                          **Path with colon parameters**
     * @param {function(parameter: Object, data: ?*)} handler
     */
    register(route, handler) {

        const pattern = { route };

        if (/\/:[^/]+/.test( route )) {

            pattern.parameter = [ ];

            route = route.replace(
                /\/:([^/]+)/g,
                (_, name)  =>  pattern.parameter.push( name ) && '/([^/]+)'
            );
        }

        pattern.pattern = new RegExp(`^${route}`);

        this.map.set(pattern, handler);
    }

    /**
     * @param {string} route
     *
     * @return {Router} This router
     */
    unregister(route) {

        for (let item of this.map.keys())
            if (item.route === route)  this.map.delete( item );

        return this;
    }

    /**
     * @param {string} path   - Route path
     * @param {*}      [data] - Extra data
     *
     * @return {*}
     */
    trigger(path, data) {

        for (let route of this.map.entries()) {

            let match = path.match( route[0].pattern ), parameter = { }, index = 1;

            if (! match)  continue;

            for (let key  of  (route[0].parameter || [ ]))
                parameter[ key ] = match[ index++ ];

            return  route[1](parameter, data);
        }
    }
}
