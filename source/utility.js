/**
 * @param {String} raw
 *
 * @return {String}
 */
export function clearPath(raw) {

    return  raw.replace(/[/\\]+/g, '/')
        .replace(/\/\.\//g, '/')
        .replace(/^\.\//g, '')
        .replace(/[^/]+\/\.\.\//g, '');
}


/**
 * @param {String|URL} URI
 * @param {?Boolean}   ESM
 *
 * @return {Promise<Event>}
 */
export function loadModule(URI, ESM) {

    return  new Promise((onload, onerror) => {

        const script = Object.assign(document.createElement('script'), {
            onload, onerror
        });

        if ( ESM )  script.type = 'module';

        script.src = clearPath( URI );

        document.head.append( script );
    });
}
