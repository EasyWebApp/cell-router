import { createCell } from 'web-cell';

export function parsePathData(URI: string) {
    const params = {},
        [path, data] = URI.split('?');

    const searchParams = new URLSearchParams(data);

    for (const key of searchParams.keys()) {
        const value = searchParams.getAll(key).map(item => {
            try {
                return JSON.parse(item);
            } catch (error) {
                return item;
            }
        });

        params[key] = value.length < 2 ? value[0] : value;
    }

    return { path, params };
}

export function scrollTo(selector: string, root?: Element) {
    const [matched, ID] = /^#(.+)/.exec(selector);

    if (ID === 'top') return window.scrollTo(0, 0);

    const anchor = (root || document).querySelector(selector);

    if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
}

interface Route {
    paths: (string | RegExp)[];
    component: Function;
}

export function matchRoutes(list: Route[], path: string) {
    for (const { paths, component: Component } of list)
        for (const item of paths)
            if (
                typeof item === 'string'
                    ? path.startsWith(item)
                    : item.exec(path)
            ) {
                const data = parsePathData(path);

                return <Component {...data.params} path={data.path} />;
            }
}
