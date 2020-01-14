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

export interface Route {
    paths: (string | RegExp)[];
    component: Function | (() => Promise<Function>);
}

export function matchRoutes(list: Route[], path: string) {
    for (const { paths, ...rest } of list)
        for (const item of paths)
            if (
                typeof item === 'string'
                    ? path.startsWith(item)
                    : item.exec(path)
            )
                return { ...rest, ...parsePathData(path) };
}
