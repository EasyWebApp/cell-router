import { parseDOM } from 'dom-renderer';


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


const { pathname } = self.location,
    ESM = (! document.querySelector(
        'script[src$="custom-elements-es5-adapter.js"]'
    ));

/**
 * @param {String} source - HTML source code
 * @param {String} [base] - Base path after `location.pathname`
 *
 * @return {Node[]}
 */
export async function loadDOM(source, base) {

    const task = [ ];

    source.replace(/<(\w+-\w+)[\s\S]*?>/g,  (_, tag) => {

        if (! self.customElements.get( tag ))
            task.push(loadModule(
                `${pathname}/${base}/${tag}.js`, ESM
            ));
    });

    await Promise.all( task );

    return  Array.from( parseDOM( source ).childNodes );
}
